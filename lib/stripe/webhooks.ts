import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'

export async function handleSubscriptionUpsert(subscription: Stripe.Subscription) {
  const supabase = createAdminClient()

  const workspaceId = subscription.metadata?.workspace_id
  if (!workspaceId) return

  // Stripe SDK v22: billing dates are on the subscription directly
  const sub = subscription as Stripe.Subscription & {
    current_period_start?: number
    current_period_end?: number
    trial_end?: number | null
  }

  await supabase.from('subscriptions').upsert(
    {
      workspace_id: workspaceId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: subscription.items.data[0]?.price.id ?? null,
      status: subscription.status,
      current_period_start: sub.current_period_start
        ? new Date(sub.current_period_start * 1000).toISOString()
        : null,
      current_period_end: sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
      trial_end: sub.trial_end
        ? new Date(sub.trial_end * 1000).toISOString()
        : null,
    },
    { onConflict: 'stripe_subscription_id' }
  )
}

export async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const supabase = createAdminClient()

  await supabase
    .from('subscriptions')
    .update({ status: 'canceled' })
    .eq('stripe_subscription_id', subscription.id)
}

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const supabase = createAdminClient()

  const workspaceId = session.metadata?.workspace_id
  if (!workspaceId || !session.customer) return

  await supabase
    .from('subscriptions')
    .update({ stripe_customer_id: session.customer as string })
    .eq('workspace_id', workspaceId)
}
