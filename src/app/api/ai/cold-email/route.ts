import { NextResponse } from "next/server";
import { chatJSON } from "@/lib/openai";
import { requireUser, consumeGeneration } from "@/lib/usage";

export async function POST(req: Request) {
  const { user, error, status } = await requireUser();
  if (error) return NextResponse.json({ error }, { status });

  const { companyName, prospectName, productDescription } = await req.json();
  if (!companyName || !prospectName || !productDescription) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const gate = await consumeGeneration(user!.id, "cold-email");
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: 402 });

  try {
    const result = await chatJSON(
      `You are an expert B2B copywriter. Return ONLY JSON with keys:
"cold_email" (a personalized cold email, with subject line on the first line),
"linkedin_dm" (a short LinkedIn connection message under 300 chars),
"follow_up_email" (a polite follow-up email referencing the first).
Be concise, specific, and human. Avoid spammy language.`,
      `Sender company: ${companyName}\nProspect name: ${prospectName}\nProduct/value: ${productDescription}`
    );

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    await supabase.from("generated_emails").insert({
      user_id: user!.id,
      company_name: companyName, prospect_name: prospectName, product_description: productDescription,
      cold_email: result.cold_email, linkedin_dm: result.linkedin_dm, follow_up_email: result.follow_up_email,
    });

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: "AI generation failed. Check your OpenAI key." }, { status: 500 });
  }
}
