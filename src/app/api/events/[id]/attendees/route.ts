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
    .from("event_attendance")
    .select("user_id, users(first_name,last_name,username)")
    .eq("event_id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers });
  }

  return NextResponse.json({ attendees: data }, { status: 200, headers });
}
