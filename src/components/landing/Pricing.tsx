import { PricingCards } from "./PricingCards";

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-lg text-slate-600">Start free. Upgrade when you grow.</p>
      </div>
      <div className="mt-16">
        <PricingCards />
      </div>
    </section>
  );
}
