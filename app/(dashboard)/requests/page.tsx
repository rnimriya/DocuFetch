import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { RequestTable } from '@/components/requests/request-table'
import { PageHeader } from '@/components/shared/page-header'
import { Plus } from 'lucide-react'

export const metadata = { title: 'Requests — DocuFetch' }

export default async function RequestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id')
    .eq('user_id', user.id)
    .not('accepted_at', 'is', null)
    .limit(1)
    .single()

  if (!membership) redirect('/onboarding')

  const { data: requests } = await supabase
    .from('document_requests')
    .select('*, document_items(status)')
    .eq('workspace_id', membership.workspace_id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Requests"
        description="All requests sent to your clients"
        action={
          <Link href="/requests/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New request
            </Button>
          </Link>
        }
      />
      <RequestTable requests={requests as any ?? []} />
    </div>
  )
}
