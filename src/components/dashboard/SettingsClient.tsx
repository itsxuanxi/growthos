"use client";
import { useState } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

export function SettingsClient({
  profile, email, limit,
}: {
  profile: Profile; email: string; limit: number;
}) {
  const supabase = createClient();
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [company, setCompany] = useState(profile?.company ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const used = profile?.ai_generations_used ?? 0;
  const pct = Math.min(100, Math.round((used / limit) * 100));

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await supabase.from("profiles").update({ full_name: fullName, company }).eq("id", profile.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function openPortal() {
    setPortalLoading(true);
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else { alert(data.error || "Unable to open billing portal."); setPortalLoading(false); }
  }

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <h2 className="font-semibold text-slate-900">Profile</h2>
        <form onSubmit={saveProfile} className="mt-4 space-y-4">
          <div><label className="label">Email</label><input className="input bg-slate-50" value={email} disabled /></div>
          <div><label className="label">Full name</label><input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
          <div><label className="label">Company</label><input className="input" value={company} onChange={(e) => setCompany(e.target.value)} /></div>
          <button disabled={saving} className="btn-primary">{saving && <Spinner />} {saved ? "Saved!" : "Save changes"}</button>
        </form>
      </section>

      <section className="card p-6">
        <h2 className="font-semibold text-slate-900">Subscription</h2>
        <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 p-4">
          <div>
            <p className="text-sm font-medium capitalize text-slate-900">{profile?.plan} plan</p>
            <p className="text-xs text-slate-500">Status: {profile?.subscription_status ?? "inactive"}</p>
          </div>
          {profile?.plan === "free" ? (
            <a href="/pricing" className="btn-primary">Upgrade</a>
          ) : (
            <button onClick={openPortal} disabled={portalLoading} className="btn-secondary">
              {portalLoading && <Spinner />} Manage billing
            </button>
          )}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="font-semibold text-slate-900">API usage</h2>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-slate-600">
            <span>{used} / {limit} AI generations this period</span>
            <span>{pct}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full bg-brand-600" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </section>
    </div>
  );
}
