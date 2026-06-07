import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowLeft, Copy, Mail, Calendar, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DocumentItemRow } from '@/components/requests/document-item-row'
import { RequestStatusBadge } from '@/components/requests/request-status-badge'
import { PageHeader } from '@/components/shared/page-header'
import { CopyPortalLink } from '@/components/requests/copy-portal-link'

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: request } = await supabase
    .from('document_requests')
    .select('*, document_items(*, document_uploads(*))')
    .eq('id', id)
    .single()

  if (!request) notFound()

  const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portal/${request.access_token}`

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2">
        <Link href="/requests">
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <ArrowLeft className="h-4 w-4" />
            Requests
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold">{request.title}</h1>
            <RequestStatusBadge status={request.status} />
          </div>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {request.client_name}
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              {request.client_email}
            </span>
            {request.due_date && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Due {format(new Date(request.due_date), 'MMM d, yyyy')}
              </span>
            )}
          </div>
          {request.description && (
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">{request.description}</p>
          )}
        </div>
        <CopyPortalLink url={portalUrl} />
      </div>

      {/* Document items */}
      <div className="space-y-3">
        <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          {request.document_items?.length ?? 0} Documents
        </h2>
        <ReviewableItems items={request.document_items ?? []} requestId={id} />
      </div>
    </div>
  )
}

// Client component wrapper for review actions
import { DocumentItemRowClient } from '@/components/requests/document-item-row-client'

function ReviewableItems({ items, requestId }: { items: any[]; requestId: string }) {
  return <DocumentItemRowClient items={items} requestId={requestId} />
}
