import { NextResponse } from "next/server";
import { chatJSON } from "@/lib/openai";
import { requireUser, consumeGeneration } from "@/lib/usage";

export async function POST(req: Request) {
  const { user, error, status } = await requireUser();
  if (error) return NextResponse.json({ error }, { status });

  const { industry, location, companySize } = await req.json();
  if (!industry || !location) {
    return NextResponse.json({ error: "Industry and location are required." }, { status: 400 });
  }

  const gate = await consumeGeneration(user!.id, "lead-finder");
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: 402 });

  try {
    const result = await chatJSON(
      `You are a B2B sales strategist. Return ONLY JSON with keys:
"customer_profile" (string, 2-3 sentences describing the ideal customer),
"prospects" (array of 5 objects each with "name","title","company","reason"),
"outreach_strategy" (string, a concise multi-step outreach plan).
Prospects should be realistic example personas, not real individuals.`,
      `Industry: ${industry}\nLocation: ${location}\nCompany size: ${companySize}`
    );

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    await supabase.from("lead_finder_results").insert({
      user_id: user!.id,
      industry, location, company_size: companySize,
      customer_profile: result.customer_profile,
      prospects: result.prospects,
      outreach_strategy: result.outreach_strategy,
    });

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: "AI generation failed. Check your OpenAI key." }, { status: 500 });
  }
}
