"use client";
import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import type { Lead, LeadStatus } from "@/types/database";

const STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "won", "lost"];
const statusStyles: Record<LeadStatus, string> = {
  new: "bg-slate-100 text-slate-700",
  contacted: "bg-blue-100 text-blue-700",
  qualified: "bg-violet-100 text-violet-700",
  won: "bg-green-100 text-green-700",
  lost: "bg-red-100 text-red-700",
};

type Draft = Partial<Lead>;

export function CrmClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return leads.filter((l) =>
      [l.name, l.company, l.email, l.status, l.notes]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q))
    );
  }, [leads, query]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const isNew = !editing.id;
      const res = await fetch(isNew ? "/api/leads" : `/api/leads/${editing.id}`, {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (isNew) setLeads([data.lead, ...leads]);
      else setLeads(leads.map((l) => (l.id === data.lead.id ? data.lead : l)));
      setEditing(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this lead?")) return;
    setLeads(leads.filter((l) => l.id !== id));
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input className="input pl-9" placeholder="Search leads…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <button onClick={() => setEditing({ status: "new" })} className="btn-primary">
          <Plus className="h-4 w-4" /> Add lead
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{l.name}</td>
                  <td className="px-4 py-3 text-slate-600">{l.company}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${statusStyles[l.status]}`}>{l.status}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{l.email}</td>
                  <td className="px-4 py-3 max-w-[200px] truncate text-slate-500">{l.notes}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => setEditing(l)} className="btn-ghost !px-2"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => remove(l.id)} className="btn-ghost !px-2 text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-slate-400">No leads yet. Add your first one.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4" onClick={() => setEditing(null)}>
          <form onClick={(e) => e.stopPropagation()} onSubmit={save} className="w-full max-w-md card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{editing.id ? "Edit lead" : "Add lead"}</h3>
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost !px-2"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="label">Name</label><input className="input" required value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><label className="label">Company</label><input className="input" value={editing.company ?? ""} onChange={(e) => setEditing({ ...editing, company: e.target.value })} /></div>
              <div><label className="label">Email</label><input className="input" type="email" value={editing.email ?? ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></div>
              <div>
                <label className="label">Status</label>
                <select className="input" value={editing.status ?? "new"} onChange={(e) => setEditing({ ...editing, status: e.target.value as LeadStatus })}>
                  {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
              </div>
              <div><label className="label">Notes</label><textarea className="input min-h-[80px]" value={editing.notes ?? ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary mt-6 w-full">{saving && <Spinner />} Save lead</button>
          </form>
        </div>
      )}
    </div>
  );
}
