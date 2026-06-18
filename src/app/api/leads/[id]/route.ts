import { NextResponse } from "next/server";
import { requireUser } from "@/lib/usage";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { supabase, user, error, status } = await requireUser();
  if (error) return NextResponse.json({ error }, { status });
  const body = await req.json();

  const { data, error: dbError } = await supabase
    .from("leads")
    .update({
      name: body.name,
      company: body.company ?? null,
      email: body.email ?? null,
      status: body.status,
      notes: body.notes ?? null,
    })
    .eq("id", id)
    .eq("user_id", user!.id)
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ lead: data });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { supabase, user, error, status } = await requireUser();
  if (error) return NextResponse.json({ error }, { status });
  const { error: dbError } = await supabase
    .from("leads").delete().eq("id", id).eq("user_id", user!.id);
  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
