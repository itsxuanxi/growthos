import { Users, UserCheck, Sparkles, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import Link from "next/link";

export default async function DashboardHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const uid = user!.id;

  const [{ count: totalLeads }, { count: contacted }, { count: aiMessages }, { data: leads }] =
    await Promise.all([
      supabase.from("leads").select("*", { count: "exact", head: true }).eq("user_id", uid),
      supabase.from("leads").select("*", { count: "exact", head: true }).eq("user_id", uid).neq("status", "new"),
      supabase.from("ai_usage_events").select("*", { count: "exact", head: true }).eq("user_id", uid),
      supabase.from("leads").select("status").eq("user_id", uid),
    ]);

  const total = totalLeads ?? 0;
  const contactedCount = contacted ?? 0;
  const responded = (leads ?? []).filter((l) =>
    ["qualified", "won"].includes(l.status as string)
  ).length;
  const responseRate = contactedCount > 0 ? Math.round((responded / contactedCount) * 100) : 0;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Your sales pipeline at a glance." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total leads" value={total} icon={Users} accent="brand" />
        <StatCard label="Leads contacted" value={contactedCount} icon={UserCheck} accent="green" />
        <StatCard label="AI messages generated" value={aiMessages ?? 0} icon={Sparkles} accent="violet" />
        <StatCard label="Response rate" value={`${responseRate}%`} icon={TrendingUp} accent="amber" />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <QuickAction href="/dashboard/lead-finder" title="Find new leads" desc="Generate ideal customer profiles and prospects with AI." />
        <QuickAction href="/dashboard/cold-email" title="Write cold outreach" desc="Personalized emails, LinkedIn DMs, and follow-ups." />
        <QuickAction href="/dashboard/assistant" title="Ask the AI assistant" desc="Get advice on pricing, conversion, and growth." />
      </div>
    </div>
  );
}

function QuickAction({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="card p-6 transition hover:border-brand-200 hover:shadow-md">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{desc}</p>
    </Link>
  );
}
