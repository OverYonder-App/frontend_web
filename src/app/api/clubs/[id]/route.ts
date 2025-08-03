"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseRouteClient";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);
  const { id } = await params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if (!user || user.app_metadata?.role_type !== "Institution Admin") {
  //   return NextResponse.json({ error: "Unauthorized" }, {
  //     status: 401,
  //     headers,
  //   });

  // }

  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("organization_id", id)
    .eq("institution_id", user?.user_metadata?.institution_id ?? "")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, {
      status: 404,
      headers,
    });
  }


  return NextResponse.json(
    { club: data },
    { status: 200, headers }
  );

}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);
  const { id } = await params;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.user_metadata?.role_type !== "Institution Admin") {
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
      .neq("organization_id", id)
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
    .eq("organization_id", id)
    .eq("institution_id", user.user_metadata?.institution_id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers }
    );

  }



  return NextResponse.json({ club: data }, { status: 200, headers });

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

  if (!user || user.app_metadata?.role_type !== "Institution Admin") {
    return NextResponse.json({ error: "Unauthorized" }, {
      status: 401,
      headers,
    });

  }

  const { error } = await supabase
    .from("organizations")
    .delete()
    .eq("organization_id", id)
    .eq("institution_id", user.user_metadata?.institution_id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers }
    );
  }

  return NextResponse.json({ success: true }, { status: 200, headers });
}
