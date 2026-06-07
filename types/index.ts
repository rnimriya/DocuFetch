export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type WorkspaceRole = 'owner' | 'admin' | 'member'

export type RequestStatus = 'draft' | 'sent' | 'partial' | 'complete' | 'expired'

export type ItemStatus = 'pending' | 'uploaded' | 'approved' | 'rejected'

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'unpaid'
  | 'incomplete'
  | 'incomplete_expired'

export type EmailType =
  | 'request_sent'
  | 'document_uploaded'
  | 'document_approved'
  | 'document_rejected'
  | 'request_complete'
  | 'reminder'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Workspace {
  id: string
  name: string
  slug: string
  owner_id: string
  logo_url: string | null
  brand_color: string
  created_at: string
  updated_at: string
}

export interface WorkspaceMember {
  id: string
  workspace_id: string
  user_id: string | null
  role: WorkspaceRole
  invited_email: string | null
  accepted_at: string | null
  created_at: string
  profile?: Profile
}

export interface Subscription {
  id: string
  workspace_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  status: SubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  trial_end: string | null
  created_at: string
  updated_at: string
}

export interface DocumentRequest {
  id: string
  workspace_id: string
  created_by: string | null
  title: string
  description: string | null
  client_name: string
  client_email: string
  status: RequestStatus
  access_token: string
  due_date: string | null
  sent_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
  document_items?: DocumentItem[]
  creator?: Profile
}

export interface DocumentItem {
  id: string
  request_id: string
  name: string
  description: string | null
  is_required: boolean
  allowed_types: string[]
  max_size_mb: number
  status: ItemStatus
  rejection_note: string | null
  sort_order: number
  created_at: string
  updated_at: string
  document_uploads?: DocumentUpload[]
}

export interface DocumentUpload {
  id: string
  item_id: string
  request_id: string
  storage_path: string
  original_filename: string
  file_size_bytes: number | null
  mime_type: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
}

export interface DashboardStats {
  total_requests: number
  pending_requests: number
  complete_requests: number
  documents_collected: number
}
