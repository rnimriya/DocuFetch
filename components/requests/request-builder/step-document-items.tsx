'use client'

import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import type { CreateRequestInput } from '@/lib/validations/request'

const FILE_TYPE_OPTIONS = ['pdf', 'jpg', 'jpeg', 'png', 'docx', 'xlsx', 'csv']

interface StepDocumentItemsProps {
  form: UseFormReturn<CreateRequestInput>
}

export function StepDocumentItems({ form }: StepDocumentItemsProps) {
  const { register, control, watch, setValue, formState: { errors } } = form
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })

  function addItem() {
    append({
      name: '',
      description: '',
      is_required: true,
      allowed_types: ['pdf'],
      max_size_mb: 20,
      sort_order: fields.length,
    })
  }

  function toggleFileType(index: number, type: string) {
    const current = watch(`items.${index}.allowed_types`) ?? []
    const updated = current.includes(type)
      ? current.filter(t => t !== type)
      : [...current, type]
    setValue(`items.${index}.allowed_types`, updated, { shouldValidate: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Required documents</h2>
        <p className="text-sm text-muted-foreground">Define each document you need from your client</p>
      </div>

      {errors.items?.root && (
        <p className="text-sm text-destructive">{errors.items.root.message}</p>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GripVertical className="h-4 w-4" />
                <span className="text-sm font-medium">Document {index + 1}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <Label>Document name</Label>
                <Input
                  placeholder="e.g. Bank Statement — Last 3 months"
                  {...register(`items.${index}.name`)}
                />
                {errors.items?.[index]?.name && (
                  <p className="text-xs text-destructive">{errors.items[index]?.name?.message}</p>
                )}
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <Label>Instructions <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Textarea
                  placeholder="Any specific instructions for this document..."
                  rows={2}
                  {...register(`items.${index}.description`)}
                />
              </div>

              <div className="space-y-2">
                <Label>Accepted file types</Label>
                <div className="flex flex-wrap gap-2">
                  {FILE_TYPE_OPTIONS.map(type => {
                    const checked = watch(`items.${index}.allowed_types`)?.includes(type)
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleFileType(index, type)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                          checked
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background text-muted-foreground border-input hover:border-primary'
                        }`}
                      >
                        .{type}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Max file size (MB)</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  {...register(`items.${index}.max_size_mb`, { valueAsNumber: true })}
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id={`required-${index}`}
                  checked={watch(`items.${index}.is_required`)}
                  onCheckedChange={checked =>
                    setValue(`items.${index}.is_required`, !!checked)
                  }
                />
                <Label htmlFor={`required-${index}`} className="font-normal cursor-pointer">
                  This document is required
                </Label>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="outline" onClick={addItem} className="w-full gap-2">
        <Plus className="h-4 w-4" />
        Add document
      </Button>
    </div>
  )
}
