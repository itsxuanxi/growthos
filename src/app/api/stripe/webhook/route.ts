import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";

// Stripe needs the raw body — disable body parsing semantics by reading text.
export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing webhook signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook signature failed: ${(err as Error).message}` }, { status: 400 });
  }

  const admin = createAdminClient();

  async function setPlan(customerId: string, plan: string, statusVal: string, subId?: string) {
    await admin
      .from("profiles")
      .update({
        plan,
        subscription_status: statusVal,
        stripe_subscription_id: subId ?? null,
      })
      .eq("stripe_customer_id", customerId);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const plan = (session.metadata?.plan as string) ?? "pro";
      await setPlan(session.customer as string, plan, "active", session.subscription as string);
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const plan = (sub.metadata?.plan as string) ?? "pro";
      const active = ["active", "trialing"].includes(sub.status);
      await setPlan(sub.customer as string, active ? plan : "free", sub.status, sub.id);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      await setPlan(sub.customer as string, "free", "canceled", sub.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}
