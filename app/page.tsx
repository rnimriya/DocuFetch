import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Upload, CheckCircle2, Shield, Zap } from 'lucide-react'

const FEATURES = [
  {
    icon: Upload,
    title: 'Zero-friction for clients',
    description: 'Clients upload documents via a branded link — no account, no passwords required.',
  },
  {
    icon: CheckCircle2,
    title: 'Approve & reject workflows',
    description: 'Review each document, approve it or request a re-upload with a note.',
  },
  {
    icon: Shield,
    title: 'Enterprise-grade security',
    description: 'All files are encrypted in transit and at rest. Signed URLs for every download.',
  },
  {
    icon: Zap,
    title: 'Automated notifications',
    description: 'Instant email alerts when clients upload. Completion emails when all docs are in.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-black">D</span>
            </div>
            DocuFetch
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center py-24 px-4">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm font-medium">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            14-day free trial · No credit card required
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Collect documents from clients{' '}
            <span className="text-primary">without the back-and-forth</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Send a branded upload link. Your client uploads what you need. You review and approve.
            No email attachments, no shared drives, no confusion.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/signup">
              <Button size="lg" className="gap-2 text-base h-12 px-8">
                Start collecting documents
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-12 text-base">
                Sign in to dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-20 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Everything you need to collect documents</h2>
            <p className="text-muted-foreground mt-2">
              Built for accountants, lawyers, mortgage brokers, and anyone who needs files from clients
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-xl border bg-card p-6 space-y-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-lg mx-auto space-y-5">
          <h2 className="text-3xl font-bold">Ready to simplify document collection?</h2>
          <p className="text-muted-foreground">
            Join professionals who use DocuFetch to spend less time chasing files.
          </p>
          <Link href="/signup">
            <Button size="lg" className="gap-2">
              Create free account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t py-8 px-4">
        <div className="container max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-black">D</span>
            </div>
            DocuFetch
          </div>
          <p>© 2024 DocuFetch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
