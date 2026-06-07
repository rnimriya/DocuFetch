'use client'

import { useState } from 'react'
import { DocumentItemRow } from './document-item-row'
import type { DocumentItem } from '@/types'

interface DocumentItemRowClientProps {
  items: DocumentItem[]
  requestId: string
}

export function DocumentItemRowClient({ items: initialItems, requestId }: DocumentItemRowClientProps) {
  const [items, setItems] = useState(initialItems)

  async function handleReview(itemId: string, action: 'approve' | 'reject', note?: string) {
    const res = await fetch(`/api/requests/${requestId}/items/${itemId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, rejection_note: note }),
    })

    if (!res.ok) {
      const { error } = await res.json()
      throw new Error(error)
    }

    const { status } = await res.json()
    setItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, status, rejection_note: action === 'reject' ? (note ?? null) : null }
          : item
      )
    )
  }

  return (
    <div className="space-y-3">
      {items.map(item => (
        <DocumentItemRow key={item.id} item={item} onReview={handleReview} />
      ))}
    </div>
  )
}
