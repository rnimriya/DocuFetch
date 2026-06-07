import { SignupForm } from '@/components/auth/signup-form'

export const metadata = { title: 'Create account — DocuFetch' }

export default function SignupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Start collecting documents from clients in minutes
        </p>
      </div>
      <SignupForm />
    </div>
  )
}
