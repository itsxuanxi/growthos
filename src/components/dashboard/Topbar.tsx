"use client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function Topbar({ email, plan }: { email: string; plan: string }) {
  const router = useRouter();
  const supabase = createClient();
  async function signOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }
  return (
    <header className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-3">
      <div className="md:hidden font-bold text-slate-900">GrowthOS</div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold capitalize text-brand-700">
          {plan} plan
        </span>
        <div className="hidden text-sm text-slate-600 sm:block">{email}</div>
        <button onClick={signOut} className="btn-ghost !px-2" aria-label="Sign out">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
