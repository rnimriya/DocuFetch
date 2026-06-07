import Stripe from 'stripe'

// Lazy singleton — defers construction to first use so the build doesn't
// fail when STRIPE_SECRET_KEY is not yet set in the environment.
let _stripe: Stripe | null = null

export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_, prop: string | symbol) {
    if (!_stripe) {
      _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2026-05-27.dahlia',
        typescript: true,
      })
    }
    return (_stripe as never)[prop as string]
  },
})
