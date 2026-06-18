import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { SettingsClient } from "@/components/dashboard/SettingsClient";
import { planLimit } from "@/lib/utils";
import type { Profile } from "@/types/database";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles").select("*").eq("id", user!.id).single();

  const p = profile as Profile;
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Settings" subtitle="Manage your profile, subscription, and usage." />
      <SettingsClient
        profile={p}
        email={user!.email ?? ""}
        limit={planLimit(p?.plan)}
      />
    </div>
  );
}
