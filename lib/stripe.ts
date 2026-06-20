import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
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
