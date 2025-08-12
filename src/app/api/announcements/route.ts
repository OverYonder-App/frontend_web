"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseRouteClient";

export async function GET(req: NextRequest) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);

  const { data, error } = await supabase
    .from("announcements")
    .select(
      "announcement_id, title, body, created_at, users:users!announcements_created_by_fkey(first_name, last_name, roles(role_name))"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers });
  }

  return NextResponse.json({ announcements: data }, { status: 200, headers });
}
