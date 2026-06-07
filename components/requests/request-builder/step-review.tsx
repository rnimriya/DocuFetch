'use client'

import { UseFormReturn } from 'react-hook-form'
import { format } from 'date-fns'
import { FileText, User, Mail, Calendar, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { CreateRequestInput } from '@/lib/validations/request'

interface StepReviewProps {
  form: UseFormReturn<CreateRequestInput>
}

export function StepReview({ form }: StepReviewProps) {
  const values = form.getValues()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Review & send</h2>
        <p className="text-sm text-muted-foreground">Confirm everything looks correct before sending</p>
      </div>

      {/* Request summary */}
      <div className="rounded-lg border bg-card p-5 space-y-4">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Request</h3>
        <p className="font-semibold text-lg">{values.title}</p>
        {values.description && (
          <p className="text-sm text-muted-foreground">{values.description}</p>
        )}
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            {values.client_name}
          </span>
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            {values.client_email}
          </span>
          {values.due_date && (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              Due {format(new Date(values.due_date), 'MMM d, yyyy')}
            </span>
          )}
        </div>
      </div>

      {/* Documents list */}
      <div className="rounded-lg border bg-card p-5 space-y-3">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          {values.items.length} Document{values.items.length !== 1 ? 's' : ''} requested
        </h3>
        {values.items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 py-2 border-b last:border-0">
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium">{item.name}</p>
                {item.is_required && (
                  <Badge variant="outline" className="text-xs">Required</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {item.allowed_types.map(t => `.${t}`).join(', ')} · max {item.max_size_mb}MB
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-start gap-3">
        <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-green-800">Ready to send</p>
          <p className="text-xs text-green-700 mt-0.5">
            An email will be sent to <strong>{values.client_email}</strong> with a secure
            upload link. No account required for your client.
          </p>
        </div>
      </div>
    </div>
  )
}
