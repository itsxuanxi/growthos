import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CrmClient } from "@/components/dashboard/CrmClient";
import type { Lead } from "@/types/database";

export default async function CrmPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader title="Lead Management CRM" subtitle="Track and organize every prospect." />
      <CrmClient initialLeads={(data as Lead[]) ?? []} />
    </div>
  );
}
