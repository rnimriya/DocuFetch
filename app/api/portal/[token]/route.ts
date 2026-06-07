import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('document_requests')
    .select('*, document_items(*, document_uploads(*)), workspaces(name, brand_color)')
    .eq('access_token', token)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 })
  }

  if (data.status === 'expired') {
    return NextResponse.json({ error: 'This request has expired' }, { status: 410 })
  }

  // Strip access_token from response
  const { access_token: _, ...safeData } = data

  return NextResponse.json({ data: safeData })
}
