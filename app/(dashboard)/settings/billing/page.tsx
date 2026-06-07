import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PlanCard } from '@/components/billing/plan-card'
import { SubscriptionStatus } from '@/components/billing/subscription-status'
import { PageHeader } from '@/components/shared/page-header'

export const metadata = { title: 'Billing — DocuFetch' }

export default async function BillingPage() {
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

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('workspace_id', membership.workspace_id)
    .single()

  const hasActiveSub = subscription &&
    ['active', 'trialing'].includes(subscription.status)

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Billing"
        description="Manage your subscription and payment details"
      />

      {hasActiveSub ? (
        <SubscriptionStatus subscription={subscription} />
      ) : (
        <div className="space-y-6">
          {subscription && <SubscriptionStatus subscription={subscription} />}
          <PlanCard />
        </div>
      )}
    </div>
  )
}
