import { createClient } from "@/lib/supabase/server";
import { planLimit } from "@/lib/utils";

export async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized", status: 401 as const, supabase, user: null };
  return { supabase, user, error: null, status: 200 as const };
}

// Checks the monthly AI limit, increments usage, and logs an event.
export async function consumeGeneration(userId: string, feature: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, ai_generations_used")
    .eq("id", userId)
    .single();

  const limit = planLimit(profile?.plan);
  const used = profile?.ai_generations_used ?? 0;
  if (used >= limit) {
    return { ok: false as const, message: `You've reached your ${profile?.plan ?? "free"} plan limit of ${limit} AI generations this month. Upgrade to continue.` };
  }

  await supabase.from("profiles").update({ ai_generations_used: used + 1 }).eq("id", userId);
  await supabase.from("ai_usage_events").insert({ user_id: userId, feature });
  return { ok: true as const };
}
