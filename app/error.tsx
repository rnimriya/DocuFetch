'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isSupabaseConfig =
    error.message?.includes('supabaseUrl') ||
    error.message?.includes('Invalid supabase')

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full space-y-5 text-center">
        <div className="h-14 w-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
          <AlertTriangle className="h-7 w-7 text-amber-600" />
        </div>

        {isSupabaseConfig ? (
          <>
            <h1 className="text-xl font-bold">Supabase not configured</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Open <code className="bg-muted px-1.5 py-0.5 rounded text-xs">.env.local</code> and
              fill in your Supabase URL and keys. Then restart the dev server.
            </p>
            <div className="rounded-lg bg-muted text-left p-4 text-xs font-mono space-y-1">
              <p>NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co</p>
              <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ…</p>
              <p>SUPABASE_SERVICE_ROLE_KEY=eyJ…</p>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground text-sm">{error.message}</p>
          </>
        )}

        <Button onClick={reset} variant="outline">Try again</Button>
      </div>
    </div>
  )
}
