import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createRequestSchema } from '@/lib/validations/request'
import { resend, FROM_EMAIL, APP_URL } from '@/lib/email/resend'
import { render } from '@react-email/components'
import { RequestSentEmail } from '@/lib/email/templates/request-sent'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .not('accepted_at', 'is', null)
    .limit(1)
    .single()

  if (!membership) return NextResponse.json({ error: 'No workspace' }, { status: 404 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  let query = supabase
    .from('document_requests')
    .select('*, document_items(*)')
    .eq('workspace_id', membership.workspace_id)
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = createRequestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { items, ...requestData } = parsed.data

  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id, workspaces(name)')
    .eq('user_id', user.id)
    .not('accepted_at', 'is', null)
    .limit(1)
    .single()

  if (!membership) return NextResponse.json({ error: 'No workspace' }, { status: 404 })

  const { data: docRequest, error: reqError } = await supabase
    .from('document_requests')
    .insert({
      ...requestData,
      workspace_id: membership.workspace_id,
      created_by: user.id,
      status: 'sent',
      sent_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (reqError) return NextResponse.json({ error: reqError.message }, { status: 500 })

  const { error: itemsError } = await supabase.from('document_items').insert(
    items.map((item, i) => ({
      ...item,
      request_id: docRequest.id,
      sort_order: i,
    }))
  )

  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 })

  // Send email to client
  const portalUrl = `${APP_URL}/portal/${docRequest.access_token}`
  const ws = membership.workspaces as unknown as { name: string } | null
  const workspaceName = ws?.name ?? 'DocuFetch'

  try {
    const html = await render(
      RequestSentEmail({
        clientName: requestData.client_name,
        workspaceName,
        requestTitle: requestData.title,
        itemCount: items.length,
        dueDate: requestData.due_date
          ? new Date(requestData.due_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : undefined,
        portalUrl,
      }) as React.ReactElement
    )

    await resend.emails.send({
      from: FROM_EMAIL,
      to: requestData.client_email,
      subject: `${workspaceName} needs ${items.length} document${items.length !== 1 ? 's' : ''} from you`,
      html,
    })

    await supabase.from('email_logs').insert({
      workspace_id: membership.workspace_id,
      request_id: docRequest.id,
      recipient_email: requestData.client_email,
      email_type: 'request_sent',
      status: 'sent',
    })
  } catch (emailErr) {
    console.error('Email send failed:', emailErr)
  }

  return NextResponse.json({ data: docRequest }, { status: 201 })
}
