import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/shared/page-header'
import { WorkspaceSettingsForm } from '@/components/dashboard/workspace-settings-form'

export const metadata = { title: 'Settings — DocuFetch' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id, workspaces(*)')
    .eq('user_id', user.id)
    .not('accepted_at', 'is', null)
    .limit(1)
    .single()

  if (!membership) redirect('/onboarding')

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Workspace settings" />
      <WorkspaceSettingsForm workspace={membership.workspaces as any} />
    </div>
  )
}
