"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseRouteClient";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { supabase } = await getSupabaseRouteHandlerClient();
  const updates = await req.json();

  const { data, error } = await supabase
    .from("organizations")
    .update(updates)
    .eq("organization_id", params.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ organization: data }, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { supabase } = await getSupabaseRouteHandlerClient();

  const { error } = await supabase
    .from("organizations")
    .delete()
    .eq("organization_id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

