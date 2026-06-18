import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="overflow-hidden rounded-3xl bg-brand-600 px-8 py-16 text-center shadow-xl">
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          Ready to get more customers?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
          Join founders and teams using GrowthOS to automate their pipeline with AI.
        </p>
        <Link href="/signup" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-semibold text-brand-700 hover:bg-brand-50">
          Start free <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
