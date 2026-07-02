"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseRouteClient";
import { getAuthContext } from "@/lib/serverAuth";

// Event ids the current user has RSVP'd to. Backs the shared RSVP store so
// every RsvpButton on a page knows its state from a single request.
export async function GET(req: NextRequest) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);

  const auth = await getAuthContext(supabase);
  if (!auth) {
    return NextResponse.json({ eventIds: [] }, { status: 200, headers });
  }

  const { data, error } = await supabase
    .from("event_attendance")
    .select("event_id")
    .eq("user_id", auth.userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers });
  }

  const eventIds = (data ?? []).map((r) => r.event_id);
  return NextResponse.json({ eventIds }, { status: 200, headers });
}
