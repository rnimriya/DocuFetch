'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { CheckCircle2, XCircle, FileText, Download, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ItemStatusBadge } from './request-status-badge'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import type { DocumentItem } from '@/types'
import { toast } from 'sonner'

interface DocumentItemRowProps {
  item: DocumentItem
  onReview: (itemId: string, action: 'approve' | 'reject', note?: string) => Promise<void>
}

export function DocumentItemRow({ item, onReview }: DocumentItemRowProps) {
  const [expanded, setExpanded] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionNote, setRejectionNote] = useState('')
  const [loading, setLoading] = useState(false)

  const latestUpload = item.document_uploads?.[item.document_uploads.length - 1]

  async function handleApprove() {
    setLoading(true)
    try {
      await onReview(item.id, 'approve')
      toast.success(`"${item.name}" approved`)
    } finally {
      setLoading(false)
    }
  }

  async function handleReject() {
    setLoading(true)
    try {
      await onReview(item.id, 'reject', rejectionNote)
      setShowRejectDialog(false)
      setRejectionNote('')
      toast.success(`"${item.name}" rejected — client notified`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="flex items-center gap-4 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted shrink-0">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-sm">{item.name}</p>
              {item.is_required && (
                <span className="text-xs text-muted-foreground">(required)</span>
              )}
              <ItemStatusBadge status={item.status} />
            </div>
            {item.description && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {item.status === 'uploaded' && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                  onClick={handleApprove}
                  disabled={loading}
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setShowRejectDialog(true)}
                  disabled={loading}
                >
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  Reject
                </Button>
              </>
            )}
            {latestUpload && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setExpanded(v => !v)}
              >
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>

        {expanded && latestUpload && (
          <div className="border-t px-4 py-3 bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{latestUpload.original_filename}</p>
                <p className="text-xs text-muted-foreground">
                  {latestUpload.file_size_bytes
                    ? `${(latestUpload.file_size_bytes / 1024 / 1024).toFixed(2)} MB · `
                    : ''}
                  Uploaded {formatDistanceToNow(new Date(latestUpload.created_at), { addSuffix: true })}
                </p>
              </div>
              <a href={`/api/requests/${item.request_id}/items/${item.id}/download`}>
                <Button size="sm" variant="outline" className="gap-1">
                  <Download className="h-3.5 w-3.5" />
                  Download
                </Button>
              </a>
            </div>
            {item.rejection_note && (
              <div className="mt-2 rounded-md bg-red-50 border border-red-100 px-3 py-2">
                <p className="text-xs text-red-700">
                  <span className="font-semibold">Rejection note:</span> {item.rejection_note}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {showRejectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 space-y-4 shadow-xl">
            <h3 className="font-semibold text-lg">Reject &ldquo;{item.name}&rdquo;</h3>
            <p className="text-sm text-muted-foreground">
              The client will be notified and asked to re-upload this document.
            </p>
            <Textarea
              placeholder="Optional: explain what needs to be corrected..."
              value={rejectionNote}
              onChange={e => setRejectionNote(e.target.value)}
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => { setShowRejectDialog(false); setRejectionNote('') }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={loading}
              >
                {loading ? 'Rejecting...' : 'Reject document'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
