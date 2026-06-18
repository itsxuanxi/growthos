import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { requireUser } from "@/lib/usage";

export async function POST() {
  const { supabase, user, error, status } = await requireUser();
  if (error) return NextResponse.json({ error }, { status });

  const { data: profile } = await supabase
    .from("profiles").select("stripe_customer_id").eq("id", user!.id).single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: "No billing account found." }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${appUrl}/dashboard/settings`,
  });

  return NextResponse.json({ url: session.url });
}
