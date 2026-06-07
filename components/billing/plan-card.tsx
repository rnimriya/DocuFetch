'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const FEATURES = [
  'Unlimited document requests',
  'Secure client upload portal',
  'Email notifications',
  'Document approval workflow',
  'Team members (up to 5)',
  'Priority support',
]

export function PlanCard() {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/billing/checkout', { method: 'POST' })
      const { url, error } = await res.json()
      if (error) throw new Error(error)
      window.location.href = url
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to start checkout')
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border-2 border-primary bg-card p-8 max-w-sm">
      <div className="mb-6">
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">Pro Plan</p>
        <div className="mt-2 flex items-end gap-1">
          <span className="text-4xl font-bold">$49</span>
          <span className="text-muted-foreground mb-1">/month</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Per workspace · Cancel anytime</p>
      </div>

      <ul className="space-y-3 mb-8">
        {FEATURES.map(feature => (
          <li key={feature} className="flex items-center gap-2.5 text-sm">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <Button onClick={handleCheckout} disabled={loading} className="w-full" size="lg">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Start free trial
      </Button>
      <p className="text-xs text-center text-muted-foreground mt-3">14-day free trial · No card required to start</p>
    </div>
  )
}
