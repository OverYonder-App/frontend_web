"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseRouteClient";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {

  const { supabase, headers } = getSupabaseRouteHandlerClient(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role_type !== "Institution Admin") {
    return NextResponse.json({ error: "Unauthorized" }, {
      status: 401,
      headers,
    });

  }

  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("organization_id", params.id)
    .eq("institution_id", user.user_metadata?.institution_id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, {
      status: 404,
      headers,
    });

  }

  const { data: history } = await supabase
    .from("organization_status_logs")
    .select("status, changed_at")
    .eq("organization_id", params.id)
    .order("changed_at", { ascending: false });


  return NextResponse.json(
    { club: data, history: history ?? [] },
    { status: 200, headers }
  );

}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role_type !== "Institution Admin") {
    return NextResponse.json({ error: "Unauthorized" }, {
      status: 401,
      headers,
    });

  }

  type Payload = {
    name?: string;
    description?: string;
    logo_url?: string;
    status?: string;
  };
  const payload: Payload = await req.json();
  const updates: Record<string, unknown> = {};
  if (payload.name) updates.name = payload.name;
  if (payload.description) updates.description = payload.description;
  if (payload.logo_url !== undefined) updates.logo_url = payload.logo_url;
  if (payload.status) {
    updates.status = payload.status;
    updates.updated_at = new Date().toISOString();
    updates.approved_by =
      payload.status === "approved" ? user.id : null;
  }

  if (payload.name) {
    const { data: existing } = await supabase
      .from("organizations")
      .select("organization_id")
      .eq("name", payload.name)
      .eq("institution_id", user.user_metadata?.institution_id)
      .eq("organization_type", "club")
      .neq("organization_id", params.id)
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        { error: "Club name already exists" },
        { status: 400, headers }

      );
    }
  }

  const { data, error } = await supabase
    .from("organizations")
    .update(updates)
    .eq("organization_id", params.id)
    .eq("institution_id", user.user_metadata?.institution_id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers }
    );

  }

  if (payload.status) {
    await supabase.from("organization_status_logs").insert({
      organization_id: params.id,
      status: payload.status,
      changed_at: new Date().toISOString(),
      changed_by: user.id,
    });
  }

  return NextResponse.json({ club: data }, { status: 200, headers });

}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.app_metadata?.role_type !== "Institution Admin") {
    return NextResponse.json({ error: "Unauthorized" }, {
      status: 401,
      headers,
    });

  }

  const { error } = await supabase
    .from("organizations")
    .delete()
    .eq("organization_id", params.id)
    .eq("institution_id", user.user_metadata?.institution_id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers }
    );
  }

  return NextResponse.json({ success: true }, { status: 200, headers });

}
