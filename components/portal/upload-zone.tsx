'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Loader2, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface UploadZoneProps {
  itemId: string
  token: string
  allowedTypes: string[]
  maxSizeMb: number
  onSuccess: () => void
}

export function UploadZone({ itemId, token, allowedTypes, maxSizeMb, onSuccess }: UploadZoneProps) {
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    if (!allowedTypes.includes(ext)) {
      toast.error(`File type .${ext} is not accepted. Allowed: ${allowedTypes.join(', ')}`)
      return
    }

    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.error(`File exceeds maximum size of ${maxSizeMb}MB`)
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('item_id', itemId)

      const res = await fetch(`/api/portal/${token}/upload`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error ?? 'Upload failed')
      }

      setUploaded(true)
      onSuccess()
      toast.success('File uploaded successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }, [itemId, token, allowedTypes, maxSizeMb, onSuccess])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: uploading || uploaded,
  })

  if (uploaded) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm font-medium py-2">
        <CheckCircle2 className="h-4 w-4" />
        File uploaded
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer',
        isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5',
        uploading && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      ) : (
        <Upload className="h-6 w-6 text-muted-foreground" />
      )}
      <div className="text-center">
        <p className="text-sm font-medium">
          {uploading ? 'Uploading...' : isDragActive ? 'Drop file here' : 'Click to upload or drag & drop'}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {allowedTypes.map(t => `.${t.toUpperCase()}`).join(', ')} · Max {maxSizeMb}MB
        </p>
      </div>
    </div>
  )
}
