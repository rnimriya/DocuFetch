import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { reviewItemSchema } from '@/lib/validations/request'
import { resend, FROM_EMAIL, APP_URL } from '@/lib/email/resend'
import { render } from '@react-email/components'
import { RequestCompleteEmail } from '@/lib/email/templates/request-complete'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const { id, itemId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = reviewItemSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
  }

  const { action, rejection_note } = parsed.data
  const newStatus = action === 'approve' ? 'approved' : 'rejected'

  // Update item status
  const { error: itemError } = await supabase
    .from('document_items')
    .update({
      status: newStatus,
      rejection_note: action === 'reject' ? (rejection_note ?? null) : null,
    })
    .eq('id', itemId)
    .eq('request_id', id)

  if (itemError) return NextResponse.json({ error: itemError.message }, { status: 500 })

  // Update upload reviewed_by/reviewed_at
  await supabase
    .from('document_uploads')
    .update({ reviewed_by: user.id, reviewed_at: new Date().toISOString() })
    .eq('item_id', itemId)

  // Check if all required items are now approved → mark request complete
  const { data: allItems } = await supabase
    .from('document_items')
    .select('status, is_required')
    .eq('request_id', id)

  if (allItems) {
    const requiredItems = allItems.filter(i => i.is_required)
    const allApproved = requiredItems.every(i => i.status === 'approved')

    if (allApproved && action === 'approve') {
      const { data: docRequest } = await supabase
        .from('document_requests')
        .update({ status: 'complete', completed_at: new Date().toISOString() })
        .eq('id', id)
        .select('*, workspaces(name, owner_id)')
        .single()

      // Send completion email to workspace owner
      if (docRequest) {
        try {
          const { data: ownerProfile } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', (docRequest as any).workspaces?.owner_id)
            .single()

          if (ownerProfile?.email) {
            const html = await render(
              RequestCompleteEmail({
                workspaceName: (docRequest as any).workspaces?.name ?? 'DocuFetch',
                requestTitle: docRequest.title,
                clientName: docRequest.client_name,
                dashboardUrl: `${APP_URL}/requests/${id}`,
              }) as React.ReactElement
            )

            await resend.emails.send({
              from: FROM_EMAIL,
              to: ownerProfile.email,
              subject: `All documents received — ${docRequest.title}`,
              html,
            })
          }
        } catch (emailErr) {
          console.error('Completion email failed:', emailErr)
        }
      }
    } else {
      // Update to partial if at least one item is done
      const anyDone = allItems.some(i => i.status === 'uploaded' || i.status === 'approved')
      if (anyDone) {
        await supabase
          .from('document_requests')
          .update({ status: 'partial' })
          .eq('id', id)
          .neq('status', 'complete')
      }
    }
  }

  return NextResponse.json({ success: true, status: newStatus })
}
