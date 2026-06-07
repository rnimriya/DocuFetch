import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/login-form'

export const metadata = { title: 'Sign in — DocuFetch' }

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to your workspace</p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
