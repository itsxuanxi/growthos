import { NextResponse } from "next/server";
import { stripe, PLANS, type PlanKey } from "@/lib/stripe";
import { requireUser } from "@/lib/usage";

export async function POST(req: Request) {
  const { supabase, user, error, status } = await requireUser();
  if (error) return NextResponse.json({ error }, { status });

  const { plan } = (await req.json()) as { plan: PlanKey };
  const selected = PLANS[plan];
  if (!selected?.priceId) {
    return NextResponse.json({ error: "Invalid plan or missing Stripe price ID." }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles").select("stripe_customer_id, email").eq("id", user!.id).single();

  let customerId = profile?.stripe_customer_id ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user!.email ?? undefined,
      metadata: { supabase_user_id: user!.id },
    });
    customerId = customer.id;
    await supabase.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user!.id);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: selected.priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/settings?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    metadata: { supabase_user_id: user!.id, plan },
    subscription_data: { metadata: { supabase_user_id: user!.id, plan } },
  });

  return NextResponse.json({ url: session.url });
}
