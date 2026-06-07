'use client'

import { useState } from 'react'
import { ItemUploadCard } from './item-upload-card'
import type { DocumentItem } from '@/types'
import { CheckCircle2 } from 'lucide-react'

interface PortalClientViewProps {
  items: DocumentItem[]
  token: string
  requestId: string
}

export function PortalClientView({ items: initialItems, token, requestId }: PortalClientViewProps) {
  const [items, setItems] = useState(initialItems)

  function handleUploaded(itemId: string) {
    setItems(prev =>
      prev.map(item => item.id === itemId ? { ...item, status: 'uploaded' as const } : item)
    )
  }

  const requiredDone = items
    .filter(i => i.is_required)
    .every(i => i.status === 'uploaded' || i.status === 'approved')

  const allDone = items.every(i => i.status === 'uploaded' || i.status === 'approved')

  return (
    <div className="space-y-4">
      {allDone && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-5 flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-800">All done!</p>
            <p className="text-sm text-green-700 mt-0.5">
              All documents have been submitted. The requester will review them shortly.
            </p>
          </div>
        </div>
      )}

      {!allDone && requiredDone && (
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
          Required documents submitted. You may optionally add the remaining documents below.
        </div>
      )}

      {items
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(item => (
          <ItemUploadCard
            key={item.id}
            item={item}
            token={token}
            onUploaded={handleUploaded}
          />
        ))}

      <p className="text-center text-xs text-gray-400 pt-4">
        Powered by DocuFetch · Files are encrypted and stored securely
      </p>
    </div>
  )
}
