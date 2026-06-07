'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StepClientInfo } from '@/components/requests/request-builder/step-client-info'
import { StepDocumentItems } from '@/components/requests/request-builder/step-document-items'
import { StepReview } from '@/components/requests/request-builder/step-review'
import { createRequestSchema, type CreateRequestInput } from '@/lib/validations/request'
import { cn } from '@/lib/utils'

const STEPS = [
  { label: 'Client details' },
  { label: 'Documents' },
  { label: 'Review & send' },
]

export default function NewRequestPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [sending, setSending] = useState(false)

  const form = useForm<CreateRequestInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createRequestSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      client_name: '',
      client_email: '',
      items: [],
    },
  })

  async function nextStep() {
    const fieldsToValidate: (keyof CreateRequestInput)[][] = [
      ['title', 'client_name', 'client_email'],
      ['items'],
      [],
    ]
    const valid = await form.trigger(fieldsToValidate[step])
    if (valid) setStep(s => s + 1)
  }

  async function onSubmit(data: CreateRequestInput) {
    setSending(true)
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to create request')

      toast.success('Request sent to client!')
      router.push(`/requests/${json.data.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
      setSending(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Stepper */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                i < step ? 'bg-primary text-primary-foreground' :
                i === step ? 'bg-primary text-primary-foreground' :
                'bg-muted text-muted-foreground'
              )}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={cn(
                'text-sm font-medium hidden sm:block',
                i === step ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                'flex-1 h-0.5 mx-3',
                i < step ? 'bg-primary' : 'bg-muted'
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="rounded-xl border bg-card p-6 md:p-8">
          {step === 0 && <StepClientInfo form={form} />}
          {step === 1 && <StepDocumentItems form={form} />}
          {step === 2 && <StepReview form={form} />}
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => step === 0 ? router.push('/requests') : setStep(s => s - 1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {step === 0 ? 'Cancel' : 'Back'}
          </Button>

          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={nextStep} className="gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={sending} className="gap-2">
              {sending
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                : <><Send className="h-4 w-4" /> Send request</>
              }
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
