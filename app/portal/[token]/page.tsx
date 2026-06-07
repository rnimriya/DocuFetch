import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { PortalHeader } from '@/components/portal/portal-header'
import { PortalClientView } from '@/components/portal/portal-client-view'

export default async function PortalPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('document_requests')
    .select('*, document_items(*, document_uploads(*)), workspaces(name, brand_color)')
    .eq('access_token', token)
    .single()

  if (error || !data) notFound()

  if (data.status === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <p className="text-xl font-semibold text-gray-700">This request has expired</p>
          <p className="text-gray-500">Please contact the sender for a new link.</p>
        </div>
      </div>
    )
  }

  const workspace = data.workspaces as { name: string; brand_color: string } | null

  return (
    <div className="min-h-screen bg-gray-50">
      <PortalHeader
        request={data as any}
        workspaceName={workspace?.name ?? 'DocuFetch'}
        brandColor={workspace?.brand_color ?? '#6366f1'}
      />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <PortalClientView
          items={data.document_items as any ?? []}
          token={token}
          requestId={data.id}
        />
      </div>
    </div>
  )
}
