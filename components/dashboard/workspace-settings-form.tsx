'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Workspace } from '@/types'

const schema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  brand_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color'),
})

export function WorkspaceSettingsForm({ workspace }: { workspace: Workspace }) {
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: workspace.name, brand_color: workspace.brand_color },
  })

  async function onSubmit(data: z.infer<typeof schema>) {
    const res = await fetch(`/api/workspaces/${workspace.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) { toast.error('Failed to save settings'); return }
    toast.success('Settings saved')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-lg border bg-card p-6">
      <div className="space-y-2">
        <Label htmlFor="name">Workspace name</Label>
        <Input id="name" {...register('name')} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="brand_color">Brand color</Label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            id="brand_color_picker"
            {...register('brand_color')}
            className="h-10 w-10 rounded border cursor-pointer"
          />
          <Input id="brand_color" {...register('brand_color')} placeholder="#6366f1" className="w-32" />
        </div>
        {errors.brand_color && <p className="text-sm text-destructive">{errors.brand_color.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save changes
      </Button>
    </form>
  )
}
