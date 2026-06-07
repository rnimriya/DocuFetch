import { Badge } from '@/components/ui/badge'
import { RequestStatus, ItemStatus } from '@/types'
import { cn } from '@/lib/utils'

const requestStatusConfig: Record<RequestStatus, { label: string; className: string }> = {
  draft:    { label: 'Draft',    className: 'bg-gray-100 text-gray-700 border-gray-200' },
  sent:     { label: 'Sent',     className: 'bg-blue-50 text-blue-700 border-blue-200' },
  partial:  { label: 'Partial',  className: 'bg-amber-50 text-amber-700 border-amber-200' },
  complete: { label: 'Complete', className: 'bg-green-50 text-green-700 border-green-200' },
  expired:  { label: 'Expired',  className: 'bg-red-50 text-red-600 border-red-200' },
}

const itemStatusConfig: Record<ItemStatus, { label: string; className: string }> = {
  pending:  { label: 'Pending',  className: 'bg-gray-100 text-gray-600 border-gray-200' },
  uploaded: { label: 'Uploaded', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  approved: { label: 'Approved', className: 'bg-green-50 text-green-700 border-green-200' },
  rejected: { label: 'Rejected', className: 'bg-red-50 text-red-600 border-red-200' },
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const config = requestStatusConfig[status]
  return (
    <Badge variant="outline" className={cn('font-medium', config.className)}>
      {config.label}
    </Badge>
  )
}

export function ItemStatusBadge({ status }: { status: ItemStatus }) {
  const config = itemStatusConfig[status]
  return (
    <Badge variant="outline" className={cn('font-medium text-xs', config.className)}>
      {config.label}
    </Badge>
  )
}
