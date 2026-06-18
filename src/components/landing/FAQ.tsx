"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "How does the AI Lead Finder work?", a: "You describe your ideal customer (industry, location, company size) and GrowthOS generates a target customer profile, suggested prospects, and a tailored outreach strategy you can act on immediately." },
  { q: "Do I need a credit card to start?", a: "No. The Free plan includes 20 AI generations per month with no credit card required. Upgrade anytime." },
  { q: "Which AI model powers GrowthOS?", a: "GrowthOS uses OpenAI's latest models to generate profiles, emails, and assistant responses, tuned with sales-specific prompting." },
  { q: "Can I cancel anytime?", a: "Yes. Manage or cancel your subscription from Settings → Subscription, powered by Stripe's secure billing portal." },
  { q: "Is my data secure?", a: "Your data is isolated per account with row-level security in Supabase, and we never share it with third parties." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-slate-50 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Frequently asked questions
        </h2>
        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-4 text-left font-medium text-slate-900"
              >
                {f.q}
                <ChevronDown className={`h-5 w-5 text-slate-400 transition ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <p className="px-6 pb-5 text-sm text-slate-600">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
