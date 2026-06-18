import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { PricingCards } from "@/components/landing/PricingCards";
import { createClient } from "@/lib/supabase/server";

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Pricing</h1>
          <p className="mt-4 text-lg text-slate-600">Start free. Upgrade when you grow.</p>
        </div>
        <div className="mt-16">
          <PricingCards authed={!!user} />
        </div>
      </main>
      <Footer />
    </>
  );
}
