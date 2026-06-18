"use client";
import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Spinner } from "@/components/ui/Spinner";
import type { Prospect } from "@/types/database";

interface Result {
  customer_profile: string;
  prospects: Prospect[];
  outreach_strategy: string;
}

export default function LeadFinderPage() {
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [companySize, setCompanySize] = useState("1-10");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/ai/lead-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, location, companySize }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate.");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="AI Lead Finder" subtitle="Describe your ideal market and let AI build your targeting." />
      <form onSubmit={handleSubmit} className="card grid gap-4 p-6 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label className="label">Industry</label>
          <input className="input" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="SaaS, e-commerce…" required />
        </div>
        <div>
          <label className="label">Location</label>
          <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="United States, EU…" required />
        </div>
        <div>
          <label className="label">Company size</label>
          <select className="input" value={companySize} onChange={(e) => setCompanySize(e.target.value)}>
            <option>1-10</option><option>11-50</option><option>51-200</option><option>201-1000</option><option>1000+</option>
          </select>
        </div>
        <div className="sm:col-span-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Spinner /> : <Search className="h-4 w-4" />} Generate leads
          </button>
        </div>
      </form>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-8 space-y-6">
          <section className="card p-6">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              <Sparkles className="h-4 w-4 text-brand-600" /> Target customer profile
            </h3>
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{result.customer_profile}</p>
          </section>

          <section className="card p-6">
            <h3 className="font-semibold text-slate-900">Prospect suggestions</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-slate-400">
                  <tr><th className="pb-2">Name</th><th className="pb-2">Title</th><th className="pb-2">Company</th><th className="pb-2">Why</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.prospects?.map((p, i) => (
                    <tr key={i}>
                      <td className="py-2 font-medium text-slate-900">{p.name}</td>
                      <td className="py-2 text-slate-600">{p.title}</td>
                      <td className="py-2 text-slate-600">{p.company}</td>
                      <td className="py-2 text-slate-500">{p.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="card p-6">
            <h3 className="font-semibold text-slate-900">Outreach strategy</h3>
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{result.outreach_strategy}</p>
          </section>
        </div>
      )}
    </div>
  );
}
