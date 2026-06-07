import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: branding panel */}
      <div className="hidden lg:flex flex-col justify-between bg-primary p-12 text-primary-foreground">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-black">D</span>
          </div>
          DocuFetch
        </Link>

        <blockquote className="space-y-2">
          <p className="text-lg leading-relaxed">
            &ldquo;DocuFetch cut our document collection time from weeks to days. Our clients
            love the simple upload experience.&rdquo;
          </p>
          <footer className="text-sm text-primary-foreground/70">
            Sofia Davis &mdash; Head of Operations, Meridian Advisors
          </footer>
        </blockquote>
      </div>

      {/* Right: form panel */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-6">
          <Link href="/" className="flex lg:hidden items-center gap-2 font-bold text-xl mb-8">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-black">D</span>
            </div>
            DocuFetch
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
