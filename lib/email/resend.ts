import { Resend } from 'resend'

// Lazy singleton — defers construction to first use so missing env vars
// don't crash the build during module evaluation.
let _client: Resend | null = null

export const resend: Resend = new Proxy({} as Resend, {
  get(_, prop: string | symbol) {
    if (!_client) {
      _client = new Resend(process.env.RESEND_API_KEY)
    }
    return (_client as never)[prop as string]
  },
})

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'noreply@docufetch.app'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
