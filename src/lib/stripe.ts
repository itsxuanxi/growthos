import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
});

export const PLANS = {
  pro: {
    name: "Pro",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    amount: 29,
  },
  team: {
    name: "Team",
    priceId: process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID,
    amount: 99,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
