import { Search, Mail, MessageSquare, Users, BarChart3, Zap } from "lucide-react";

const features = [
  { icon: Search, title: "AI Lead Finder", desc: "Describe your ideal customer and let AI build target profiles, prospect lists, and outreach strategies." },
  { icon: Mail, title: "Cold Email Generator", desc: "Generate personalized cold emails, LinkedIn DMs, and follow-ups in seconds — ready to send." },
  { icon: MessageSquare, title: "AI Sales Assistant", desc: "A ChatGPT-style coach for pricing, conversion, and growth questions, trained for founders." },
  { icon: Users, title: "Lead Management CRM", desc: "Track every prospect with statuses, notes, and search — no spreadsheet chaos." },
  { icon: BarChart3, title: "Growth Analytics", desc: "See leads, contacts, messages, and response rate at a glance on your dashboard." },
  { icon: Zap, title: "Automation Ready", desc: "Built on a modern stack so your pipeline scales as fast as you do." },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Everything you need to grow
        </h2>
        <p className="mt-4 text-lg text-slate-600">
          One platform that replaces a stack of expensive sales tools.
        </p>
      </div>
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="card p-6 transition hover:shadow-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">{f.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
