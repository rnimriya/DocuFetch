# DocuFetch

A production-ready Micro-SaaS for secure client document collection.

Send a branded upload link → client uploads files (no account needed) → you review, approve or reject → request auto-completes when all docs are in.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), Tailwind CSS v4, Shadcn/ui
- **Backend/Database:** Supabase (PostgreSQL + RLS + Storage + Auth)
- **Payments:** Stripe (subscription billing, webhook handling)
- **Email:** Resend + React Email
- **Hosting:** Vercel + Supabase

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/rnimriya/DocuFetch.git
cd DocuFetch
npm install
```

### 2. Configure environment variables

Fill in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set up Supabase

1. Run `supabase/migrations/20240101000000_init.sql` in the Supabase SQL editor
2. Create a **private** Storage bucket named `documents`
3. Add `{your_url}/auth/callback` to Auth redirect URLs

### 4. Set up Stripe

1. Create a monthly price at $49, copy → `STRIPE_PRICE_ID`
2. Register webhook → `{your_url}/api/webhooks/stripe`
3. Subscribe to: `customer.subscription.*`, `invoice.payment_*`, `checkout.session.completed`

### 5. Run

```bash
npm run dev
```

## Key Features

- **Zero-friction client portal** — clients upload via a secure token link, no account required
- **Structured document requests** — define required documents with file type and size constraints
- **Approve/reject workflow** — review each upload, reject with a note to prompt re-upload
- **Automated emails** — request sent, document uploaded, request complete
- **Multi-tenant workspaces** — full row-level security via Supabase RLS
- **Stripe subscription billing** — 14-day free trial, idempotent webhook handling

## License

MIT
