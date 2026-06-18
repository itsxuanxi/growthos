import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 to-white">
      <div className="mx-auto max-w-7xl px-6 py-24 text-center md:py-32">
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-sm font-medium text-brand-700">
            <Sparkles className="h-4 w-4" /> AI-powered sales for modern teams
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 md:text-6xl">
            Get More Customers <span className="text-brand-600">with AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            AI-powered lead generation and sales automation for modern businesses.
            Find prospects, write personalized outreach, and close more deals — on autopilot.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="btn-primary px-6 py-3 text-base">
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#features" className="btn-secondary px-6 py-3 text-base">See how it works</a>
          </div>
          <p className="mt-4 text-sm text-slate-400">Free plan • No credit card required</p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-brand-100">
          <div className="rounded-xl bg-slate-50 p-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                ["Total Leads", "1,248"],
                ["Contacted", "612"],
                ["AI Messages", "3,904"],
                ["Response Rate", "34%"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-white p-4 text-left shadow-sm">
                  <p className="text-xs font-medium text-slate-500">{k}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
