"use client";
import { useState } from "react";
import { Mail } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Spinner } from "@/components/ui/Spinner";
import { CopyButton } from "@/components/ui/CopyButton";

interface Result {
  cold_email: string;
  linkedin_dm: string;
  follow_up_email: string;
}

export default function ColdEmailPage() {
  const [companyName, setCompanyName] = useState("");
  const [prospectName, setProspectName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/ai/cold-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, prospectName, productDescription }),
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

  const blocks: { title: string; key: keyof Result }[] = [
    { title: "Cold email", key: "cold_email" },
    { title: "LinkedIn DM", key: "linkedin_dm" },
    { title: "Follow-up email", key: "follow_up_email" },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="AI Cold Email Generator" subtitle="Personalized outreach in three formats, ready to send." />
      <form onSubmit={handleSubmit} className="card grid gap-4 p-6 sm:grid-cols-2">
        <div>
          <label className="label">Your company name</label>
          <input className="input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="GrowthOS" required />
        </div>
        <div>
          <label className="label">Prospect name</label>
          <input className="input" value={prospectName} onChange={(e) => setProspectName(e.target.value)} placeholder="Alex Rivera" required />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Product description</label>
          <textarea className="input min-h-[90px]" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="What you sell and the value it delivers…" required />
        </div>
        <div className="sm:col-span-2">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Spinner /> : <Mail className="h-4 w-4" />} Generate outreach
          </button>
        </div>
      </form>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

      {result && (
        <div className="mt-8 space-y-6">
          {blocks.map((b) => (
            <section key={b.key} className="card p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">{b.title}</h3>
                <CopyButton text={result[b.key]} />
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{result[b.key]}</p>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
