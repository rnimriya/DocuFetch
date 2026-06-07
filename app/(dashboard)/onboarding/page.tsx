'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  name: z.string().min(2, 'Workspace name must be at least 2 characters').max(100),
})

export default function OnboardingPage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  async function onSubmit({ name }: { name: string }) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error('Session expired'); return }

    // Create workspace
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
    const { data: workspace, error: wsError } = await supabase
      .from('workspaces')
      .insert({ name, slug: `${slug}-${Date.now()}`, owner_id: user.id })
      .select()
      .single()

    if (wsError) { toast.error('Failed to create workspace'); return }

    // Add owner as member
    await supabase.from('workspace_members').insert({
      workspace_id: workspace.id,
      user_id: user.id,
      role: 'owner',
      accepted_at: new Date().toISOString(),
    })

    // Create a trial subscription record
    await supabase.from('subscriptions').insert({
      workspace_id: workspace.id,
      status: 'trialing',
      trial_end: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    })

    toast.success(`Welcome to ${name}!`)
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground text-2xl font-black">D</span>
          </div>
          <h1 className="text-2xl font-bold">Create your workspace</h1>
          <p className="text-muted-foreground mt-2">
            Your workspace is where you&apos;ll manage all your document requests
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-xl border bg-card p-6">
          <div className="space-y-2">
            <Label htmlFor="name">Workspace name</Label>
            <Input
              id="name"
              placeholder="Acme Accounting"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message as string}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create workspace
          </Button>
        </form>
      </div>
    </div>
  )
}
