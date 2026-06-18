import { redirect } from "next/navigation";
import { Users, DollarSign, Sparkles, CreditCard } from "lucide-react";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/StatCard";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { PLANS } from "@/lib/stripe";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: me } = await supabase.from("profiles").select("is_admin").eq("id", user!.id).single();

  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((e) => e.trim());
  if (!me?.is_admin && !adminEmails.includes(user!.email ?? "")) redirect("/dashboard");

  const admin = createAdminClient();
  const [{ count: totalUsers }, { count: aiUsage }, { data: profiles }] = await Promise.all([
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin.from("ai_usage_events").select("*", { count: "exact", head: true }),
    admin.from("profiles").select("plan, subscription_status, email, created_at"),
  ]);

  const active = (profiles ?? []).filter((p) => p.subscription_status === "active");
  const revenue = active.reduce((sum, p) => sum + (PLANS[p.plan as "pro" | "team"]?.amount ?? 0), 0);

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="Platform-wide metrics." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={totalUsers ?? 0} icon={Users} accent="brand" />
        <StatCard label="MRR" value={`$${revenue.toLocaleString()}`} icon={DollarSign} accent="green" />
        <StatCard label="AI usage events" value={aiUsage ?? 0} icon={Sparkles} accent="violet" />
        <StatCard label="Active subscriptions" value={active.length} icon={CreditCard} accent="amber" />
      </div>

      <section className="card mt-8 overflow-hidden">
        <h3 className="border-b border-slate-100 px-6 py-4 font-semibold text-slate-900">Recent users</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr><th className="px-6 py-3">Email</th><th className="px-6 py-3">Plan</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Joined</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(profiles ?? []).slice(0, 20).map((p, i) => (
                <tr key={i}>
                  <td className="px-6 py-3 text-slate-900">{p.email}</td>
                  <td className="px-6 py-3 capitalize text-slate-600">{p.plan}</td>
                  <td className="px-6 py-3 text-slate-600">{p.subscription_status ?? "—"}</td>
                  <td className="px-6 py-3 text-slate-500">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
