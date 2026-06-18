"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

const tiers = [
  {
    key: "free", name: "Free", price: "$0", period: "forever",
    desc: "For trying things out.",
    features: ["20 AI generations / month", "Lead Management CRM", "AI Sales Assistant", "1 user"],
    cta: "Start free", highlighted: false,
  },
  {
    key: "pro", name: "Pro", price: "$29", period: "/month",
    desc: "For founders and freelancers.",
    features: ["1,000 AI generations / month", "AI Lead Finder", "Cold Email Generator", "Priority support", "1 user"],
    cta: "Upgrade to Pro", highlighted: true,
  },
  {
    key: "team", name: "Team", price: "$99", period: "/month",
    desc: "For growing agencies & teams.",
    features: ["5,000 AI generations / month", "Everything in Pro", "Up to 10 users", "Team analytics", "Dedicated support"],
    cta: "Upgrade to Team", highlighted: false,
  },
];

export function PricingCards({ authed = false }: { authed?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSelect(key: string) {
    if (key === "free") {
      router.push(authed ? "/dashboard" : "/signup");
      return;
    }
    if (!authed) {
      router.push(`/signup?plan=${key}`);
      return;
    }
    setLoading(key);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: key }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Unable to start checkout.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {tiers.map((t) => (
        <div
          key={t.key}
          className={`card relative p-8 ${t.highlighted ? "ring-2 ring-brand-600 shadow-lg" : ""}`}
        >
          {t.highlighted && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
              Most popular
            </span>
          )}
          <h3 className="text-lg font-semibold text-slate-900">{t.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{t.desc}</p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-slate-900">{t.price}</span>
            <span className="text-sm text-slate-500">{t.period}</span>
          </div>
          <button
            onClick={() => handleSelect(t.key)}
            disabled={loading === t.key}
            className={`mt-6 w-full ${t.highlighted ? "btn-primary" : "btn-secondary"}`}
          >
            {loading === t.key && <Spinner />} {t.cta}
          </button>
          <ul className="mt-8 space-y-3">
            {t.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {f}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
