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

  return NextResponse.json({ event: data }, { status: 200, headers });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);
  const { id } = await params;

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

  return NextResponse.json({ success: true }, { status: 200, headers });
}

