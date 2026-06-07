import { ShieldCheck } from 'lucide-react'
import type { DocumentRequest } from '@/types'
import { format } from 'date-fns'

interface PortalHeaderProps {
  request: DocumentRequest
  workspaceName: string
  brandColor?: string
}

export function PortalHeader({ request, workspaceName, brandColor = '#6366f1' }: PortalHeaderProps) {
  return (
    <div className="bg-white border-b">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: brandColor }}
          >
            {workspaceName.slice(0, 2).toUpperCase()}
          </div>
          <span className="font-semibold text-gray-900">{workspaceName}</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">{request.title}</h1>
        <p className="text-gray-500 mt-1">Requested for {request.client_name}</p>

        {request.description && (
          <p className="text-gray-600 text-sm mt-3 leading-relaxed">{request.description}</p>
        )}

        <div className="flex items-center gap-4 mt-4 flex-wrap">
          {request.due_date && (
            <span className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
              Due {format(new Date(request.due_date), 'MMM d, yyyy')}
            </span>
          )}
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
            Secure upload — files are encrypted in transit
          </span>
        </div>
      </div>
    </div>
  )
}
