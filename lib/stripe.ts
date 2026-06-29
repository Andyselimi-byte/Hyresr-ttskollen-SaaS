import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { apiVersion: "2025-02-24.acacia" });
  }
  return _stripe;
}

// Keep named export for backwards compat — lazily resolved at call-time
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string, unknown>)[prop as string];
  },
});

export const STRIPE_PRICES = {
  PREMIUM_MONTHLY: process.env.STRIPE_PRICE_MONTHLY ?? "",
  PREMIUM_YEARLY:  process.env.STRIPE_PRICE_YEARLY ?? "",
};

export const FREE_LIMITS = {
  rentAnalysesPerMonth: 2,
  contractAnalysesPerMonth: 0,
  lettersPerMonth: 2,
};
