import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { validateUpload } from '@/lib/validations/upload'
import { resend, FROM_EMAIL, APP_URL } from '@/lib/email/resend'
import { render } from '@react-email/components'
import { DocumentUploadedEmail } from '@/lib/email/templates/document-uploaded'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = createAdminClient()

  // Verify token and get request
  const { data: docRequest, error: reqError } = await supabase
    .from('document_requests')
    .select('*, document_items(*), workspaces(name, owner_id)')
    .eq('access_token', token)
    .single()

  if (reqError || !docRequest) {
    return NextResponse.json({ error: 'Invalid upload token' }, { status: 404 })
  }

  if (docRequest.status === 'expired' || docRequest.status === 'complete') {
    return NextResponse.json({ error: 'This request is no longer accepting uploads' }, { status: 410 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File
  const itemId = formData.get('item_id') as string

  if (!file || !itemId) {
    return NextResponse.json({ error: 'Missing file or item_id' }, { status: 400 })
  }

  const item = docRequest.document_items?.find((i: { id: string }) => i.id === itemId)
  if (!item) {
    return NextResponse.json({ error: 'Document item not found in this request' }, { status: 404 })
  }

  // Validate file
  const validation = validateUpload(
    { name: file.name, size: file.size, type: file.type },
    item.allowed_types,
    item.max_size_mb
  )

  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 422 })
  }

  // Upload to Supabase Storage
  const storagePath = `${docRequest.workspace_id}/${docRequest.id}/${itemId}/${Date.now()}-${file.name}`
  const arrayBuffer = await file.arrayBuffer()

  const { error: storageError } = await supabase.storage
    .from('documents')
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    })

  if (storageError) {
    return NextResponse.json({ error: 'Storage upload failed' }, { status: 500 })
  }

  // Create upload record
  const { error: uploadError } = await supabase.from('document_uploads').insert({
    item_id: itemId,
    request_id: docRequest.id,
    storage_path: storagePath,
    original_filename: file.name,
    file_size_bytes: file.size,
    mime_type: file.type,
  })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  // Update item status to uploaded
  await supabase
    .from('document_items')
    .update({ status: 'uploaded', rejection_note: null })
    .eq('id', itemId)

  // Update request status to partial if still sent
  await supabase
    .from('document_requests')
    .update({ status: 'partial' })
    .eq('id', docRequest.id)
    .eq('status', 'sent')

  // Notify workspace owner
  try {
    const { data: ownerProfile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', (docRequest.workspaces as { owner_id: string }).owner_id)
      .single()

    if (ownerProfile?.email) {
      const html = await render(
        DocumentUploadedEmail({
          clientName: docRequest.client_name,
          documentName: item.name,
          requestTitle: docRequest.title,
          dashboardUrl: `${APP_URL}/requests/${docRequest.id}`,
        }) as React.ReactElement
      )

      await resend.emails.send({
        from: FROM_EMAIL,
        to: ownerProfile.email,
        subject: `${docRequest.client_name} uploaded "${item.name}"`,
        html,
      })

      await supabase.from('email_logs').insert({
        workspace_id: docRequest.workspace_id,
        request_id: docRequest.id,
        recipient_email: ownerProfile.email,
        email_type: 'document_uploaded',
        status: 'sent',
      })
    }
  } catch (emailErr) {
    console.error('Notification email failed:', emailErr)
  }

  return NextResponse.json({ success: true })
}
