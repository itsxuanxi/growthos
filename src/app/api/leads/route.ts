import { NextResponse } from "next/server";
import { requireUser } from "@/lib/usage";

export async function GET() {
  const { supabase, user, error, status } = await requireUser();
  if (error) return NextResponse.json({ error }, { status });
  const { data } = await supabase
    .from("leads").select("*").eq("user_id", user!.id)
    .order("created_at", { ascending: false });
  return NextResponse.json({ leads: data ?? [] });
}

export async function POST(req: Request) {
  const { supabase, user, error, status } = await requireUser();
  if (error) return NextResponse.json({ error }, { status });
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "Name is required." }, { status: 400 });

  const { data, error: dbError } = await supabase
    .from("leads")
    .insert({
      user_id: user!.id,
      name: body.name,
      company: body.company ?? null,
      email: body.email ?? null,
      status: body.status ?? "new",
      notes: body.notes ?? null,
    })
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ lead: data });
}
