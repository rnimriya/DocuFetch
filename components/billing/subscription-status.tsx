'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { CreditCard, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import type { Subscription } from '@/types'
import { cn } from '@/lib/utils'

interface SubscriptionStatusProps {
  subscription: Subscription | null
}

const STATUS_CONFIG = {
  active:             { label: 'Active',     className: 'bg-green-50 text-green-700 border-green-200' },
  trialing:           { label: 'Trial',      className: 'bg-blue-50 text-blue-700 border-blue-200' },
  past_due:           { label: 'Past due',   className: 'bg-red-50 text-red-700 border-red-200' },
  canceled:           { label: 'Canceled',   className: 'bg-gray-100 text-gray-600 border-gray-200' },
  unpaid:             { label: 'Unpaid',     className: 'bg-red-50 text-red-700 border-red-200' },
  incomplete:         { label: 'Incomplete', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  incomplete_expired: { label: 'Expired',   className: 'bg-gray-100 text-gray-600 border-gray-200' },
}

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  const [loading, setLoading] = useState(false)

  async function handlePortal() {
    setLoading(true)
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to open billing portal')
      setLoading(false)
    }
  }

  if (!subscription) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center space-y-3">
        <CreditCard className="h-8 w-8 text-muted-foreground mx-auto" />
        <div>
          <p className="font-medium">No active subscription</p>
          <p className="text-sm text-muted-foreground">Start a plan to send unlimited document requests</p>
        </div>
      </div>
    )
  }

  const config = STATUS_CONFIG[subscription.status]
  const isPastDue = subscription.status === 'past_due' || subscription.status === 'unpaid'

  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold">Pro Plan</p>
            <p className="text-sm text-muted-foreground">$49/month per workspace</p>
          </div>
        </div>
        <Badge variant="outline" className={cn('font-medium', config.className)}>
          {config.label}
        </Badge>
      </div>

      {isPastDue && (
        <div className="flex items-start gap-2 rounded-md bg-red-50 border border-red-200 p-3">
          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">
            Payment failed. Update your billing details to keep your account active.
          </p>
        </div>
      )}

      {subscription.current_period_end && (
        <p className="text-sm text-muted-foreground">
          {subscription.cancel_at_period_end ? 'Cancels' : 'Renews'} on{' '}
          <strong>{format(new Date(subscription.current_period_end), 'MMMM d, yyyy')}</strong>
        </p>
      )}

      <Button onClick={handlePortal} variant="outline" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Manage billing
      </Button>
    </div>
  )
}
