import { z } from 'zod'

export const ALLOWED_MIME_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
}

export function validateUpload(
  file: { name: string; size: number; type: string },
  allowedTypes: string[],
  maxSizeMb: number
): { valid: boolean; error?: string } {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? ''

  if (!allowedTypes.includes(ext)) {
    return {
      valid: false,
      error: `File type .${ext} is not allowed. Accepted: ${allowedTypes.join(', ')}`,
    }
  }

  if (file.size > maxSizeMb * 1024 * 1024) {
    return {
      valid: false,
      error: `File exceeds maximum size of ${maxSizeMb}MB`,
    }
  }

  return { valid: true }
}

export const uploadSchema = z.object({
  item_id: z.string().uuid(),
  token: z.string().min(1),
})
