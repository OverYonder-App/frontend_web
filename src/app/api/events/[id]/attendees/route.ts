"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseRouteClient";
import { getAuthContext } from "@/lib/serverAuth";

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

// RSVP the current user to this event. Idempotent: a repeat RSVP is a no-op
// thanks to the unique (user_id, event_id) constraint on event_attendance.
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);
  const { id } = await params;

  const auth = await getAuthContext(supabase);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
  }

  const { error } = await supabase
    .from("event_attendance")
    .upsert(
      { event_id: id, user_id: auth.userId },
      { onConflict: "user_id,event_id", ignoreDuplicates: true }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers });
  }

  return NextResponse.json({ attending: true }, { status: 200, headers });
}

// Cancel the current user's RSVP.
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);
  const { id } = await params;

  const auth = await getAuthContext(supabase);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
  }

  const { error } = await supabase
    .from("event_attendance")
    .delete()
    .eq("event_id", id)
    .eq("user_id", auth.userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers });
  }

  return NextResponse.json({ attending: false }, { status: 200, headers });
}
