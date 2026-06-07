'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ArrowRight, FileText } from 'lucide-react'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { RequestStatusBadge } from './request-status-badge'
import { EmptyState } from '@/components/shared/empty-state'
import type { DocumentRequest } from '@/types'

interface RequestTableProps {
  requests: DocumentRequest[]
  onNewRequest?: () => void
}

export function RequestTable({ requests, onNewRequest }: RequestTableProps) {
  if (requests.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No requests yet"
        description="Send your first document request to a client and track uploads in real time."
        action={onNewRequest ? { label: 'Create request', onClick: onNewRequest } : undefined}
      />
    )
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead>Request</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-16" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map(req => {
            const total = req.document_items?.length ?? 0
            const done  = req.document_items?.filter(i => i.status === 'approved').length ?? 0
            return (
              <TableRow key={req.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">{req.title}</TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium">{req.client_name}</p>
                    <p className="text-xs text-muted-foreground">{req.client_email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {done}/{total}
                    <span className="text-muted-foreground"> approved</span>
                  </span>
                </TableCell>
                <TableCell>
                  <RequestStatusBadge status={req.status} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(req.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <Link href={`/requests/${req.id}`}>
                    <Button variant="ghost" size="sm">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
