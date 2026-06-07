import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FolderOpen, CheckCircle2, Clock, FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RequestTable } from '@/components/requests/request-table'
import { PageHeader } from '@/components/shared/page-header'

export const metadata = { title: 'Dashboard — DocuFetch' }

export default async function DashboardPage() {
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
    .limit(10)

  const stats = {
    total:    requests?.length ?? 0,
    sent:     requests?.filter(r => r.status === 'sent' || r.status === 'partial').length ?? 0,
    complete: requests?.filter(r => r.status === 'complete').length ?? 0,
    docs:     requests?.flatMap(r => r.document_items ?? [])
                       .filter(i => i.status === 'approved').length ?? 0,
  }

  const recentRequests = requests?.slice(0, 5) ?? []

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="Track your document requests at a glance"
        action={
          <Link href="/requests/new">
            <Button>New request</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatsCard title="Total requests" value={stats.total} icon={FolderOpen} />
        <StatsCard title="Awaiting docs" value={stats.sent}  icon={Clock} description="sent or partially complete" />
        <StatsCard title="Completed"     value={stats.complete} icon={CheckCircle2} />
        <StatsCard title="Docs approved" value={stats.docs}  icon={FileCheck} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent requests</h2>
          <Link href="/requests" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <RequestTable requests={recentRequests as any} />
      </div>
    </div>
  )
}
