import { z } from 'zod'

export const documentItemSchema = z.object({
  name: z.string().min(1, 'Document name is required').max(100),
  description: z.string().max(500).optional(),
  is_required: z.boolean().default(true),
  allowed_types: z.array(z.string()).min(1, 'Select at least one file type'),
  max_size_mb: z.number().min(1).max(100).default(20),
  sort_order: z.number().default(0),
})

export const createRequestSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(1000).optional(),
  client_name: z.string().min(1, 'Client name is required').max(200),
  client_email: z.string().email('Invalid email address'),
  due_date: z.string().optional(),
  items: z.array(documentItemSchema).min(1, 'At least one document is required'),
})

export const reviewItemSchema = z.object({
  action: z.enum(['approve', 'reject']),
  rejection_note: z.string().max(500).optional(),
})

export type CreateRequestInput = z.infer<typeof createRequestSchema>
export type DocumentItemInput = z.infer<typeof documentItemSchema>
export type ReviewItemInput = z.infer<typeof reviewItemSchema>
