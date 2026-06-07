'use client'

import { UseFormReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { CreateRequestInput } from '@/lib/validations/request'

interface StepClientInfoProps {
  form: UseFormReturn<CreateRequestInput>
}

export function StepClientInfo({ form }: StepClientInfoProps) {
  const { register, formState: { errors } } = form

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Request details</h2>
        <p className="text-sm text-muted-foreground">Give this request a title and tell us who it&apos;s for</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Request title</Label>
          <Input
            id="title"
            placeholder="e.g. Q4 2024 Audit Documents"
            {...register('title')}
          />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="description">
            Description
            <span className="text-muted-foreground font-normal ml-1">(optional)</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Add any instructions or context for the client..."
            rows={3}
            {...register('description')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="client_name">Client name</Label>
          <Input
            id="client_name"
            placeholder="Jane Smith"
            {...register('client_name')}
          />
          {errors.client_name && <p className="text-sm text-destructive">{errors.client_name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="client_email">Client email</Label>
          <Input
            id="client_email"
            type="email"
            placeholder="jane@example.com"
            {...register('client_email')}
          />
          {errors.client_email && <p className="text-sm text-destructive">{errors.client_email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="due_date">
            Due date
            <span className="text-muted-foreground font-normal ml-1">(optional)</span>
          </Label>
          <Input
            id="due_date"
            type="date"
            {...register('due_date')}
          />
        </div>
      </div>
    </div>
  )
}
