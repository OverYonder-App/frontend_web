"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseRouteClient";
import { updateCalendarEvent, deleteCalendarEvent } from "@/lib/googleClient";
import { revalidateTag } from "next/cache";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);
  const { id } = await params;

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("event_id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Event not found" },
      { status: 404, headers }
    );
  }

  return NextResponse.json({ event: data }, { status: 200, headers });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);
  const { id } = await params;
  const updates = await req.json();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("event_id", id)
    .select("*")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Event not found" },
      { status: 404, headers }
    );
  }
  if (user) {
    try {
      await updateCalendarEvent(user.id, data);
    } catch (e) {
      console.error(e);
    }
  }
  revalidateTag("events");

  return NextResponse.json({ event: data }, { status: 200, headers });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);
  const { id } = await params;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("event_id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers }
    );
  }
  if (user) {
    try {
      await deleteCalendarEvent(user.id, id);
    } catch (e) {
      console.error(e);
    }
  }
  revalidateTag("events");

  return NextResponse.json({ success: true }, { status: 200, headers });
}

