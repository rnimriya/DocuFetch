'use client'

import { useState } from 'react'
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import { UploadZone } from './upload-zone'
import type { DocumentItem } from '@/types'
import { cn } from '@/lib/utils'

interface ItemUploadCardProps {
  item: DocumentItem
  token: string
  onUploaded: (itemId: string) => void
}

export function ItemUploadCard({ item, token, onUploaded }: ItemUploadCardProps) {
  const [isDone, setIsDone] = useState(
    item.status === 'uploaded' || item.status === 'approved'
  )
  const isRejected = item.status === 'rejected'

  return (
    <div className={cn(
      'rounded-xl border bg-white p-5 space-y-4 shadow-sm',
      isDone && 'border-green-200',
      isRejected && 'border-amber-200'
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          'h-10 w-10 rounded-lg flex items-center justify-center shrink-0',
          isDone ? 'bg-green-100' : isRejected ? 'bg-amber-100' : 'bg-gray-100'
        )}>
          {isDone
            ? <CheckCircle2 className="h-5 w-5 text-green-600" />
            : isRejected
            ? <AlertCircle className="h-5 w-5 text-amber-600" />
            : <FileText className="h-5 w-5 text-gray-500" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
            {item.is_required && (
              <span className="text-xs bg-red-50 text-red-600 border border-red-100 rounded-full px-2 py-0.5">
                Required
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
          )}
        </div>
      </div>

      {isRejected && item.rejection_note && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
          <span className="font-medium">Please re-upload: </span>{item.rejection_note}
        </div>
      )}

      {!isDone && (
        <UploadZone
          itemId={item.id}
          token={token}
          allowedTypes={item.allowed_types}
          maxSizeMb={item.max_size_mb}
          onSuccess={() => {
            setIsDone(true)
            onUploaded(item.id)
          }}
        />
      )}

      {isDone && !isRejected && (
        <div className="text-sm text-green-700 font-medium flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4" />
          Document received
        </div>
      )}
    </div>
  )
}
