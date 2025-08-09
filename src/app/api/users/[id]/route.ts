"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseRouteClient";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);
  const { id } = await params;

  const { data, error } = await supabase
    .from("users")
    .select("*, institutions(institution_name)")
    .eq("user_id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers });
  }

  if (!data) {
    return NextResponse.json({ error: "User not found" }, { status: 404, headers });
  }

  return NextResponse.json({ user: data }, { status: 200, headers });
}

