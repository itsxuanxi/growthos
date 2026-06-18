import { NextResponse } from "next/server";
import { openai, OPENAI_MODEL } from "@/lib/openai";
import { requireUser, consumeGeneration } from "@/lib/usage";

export async function POST(req: Request) {
  const { user, error, status } = await requireUser();
  if (error) return NextResponse.json({ error }, { status });

  const { messages } = await req.json();
  if (!Array.isArray(messages)) {
    return NextResponse.json({ error: "messages array required." }, { status: 400 });
  }

  const gate = await consumeGeneration(user!.id, "assistant");
  if (!gate.ok) return NextResponse.json({ error: gate.message }, { status: 402 });

  try {
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are GrowthOS, an AI sales and growth coach for startup founders, freelancers, agencies, and small businesses. Give practical, specific, actionable advice on lead generation, pricing, conversion, and sales. Keep answers focused and well-structured.",
        },
        ...messages.slice(-12).map((m: { role: string; content: string }) => ({
          role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
          content: m.content,
        })),
      ],
    });

    const reply = completion.choices[0]?.message?.content ?? "";

    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const last = messages[messages.length - 1];
    await supabase.from("chat_messages").insert([
      { user_id: user!.id, role: "user", content: last?.content ?? "" },
      { user_id: user!.id, role: "assistant", content: reply },
    ]);

    return NextResponse.json({ reply });
  } catch (e) {
    return NextResponse.json({ error: "AI request failed. Check your OpenAI key." }, { status: 500 });
  }
}
