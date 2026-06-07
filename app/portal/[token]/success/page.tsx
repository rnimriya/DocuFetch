import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export default function PortalSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center space-y-4 max-w-sm">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">All done!</h1>
        <p className="text-gray-500">
          Your documents have been submitted successfully. The requester will be notified and will
          review them shortly.
        </p>
        <p className="text-xs text-gray-400 pt-4">You may close this window</p>
      </div>
    </div>
  )
}
