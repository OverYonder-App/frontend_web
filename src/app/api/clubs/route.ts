"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseRouteClient";

const PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
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

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("q");
  const page = Number(searchParams.get("page") ?? "1");
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("organizations")
    .select("*", { count: "exact" })
    .eq("organization_type", "club")
    .eq("institution_id", user.user_metadata?.institution_id);

  if (status) query = query.eq("status", status);
  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {

    return NextResponse.json(
      { error: error.message },
      { status: 500, headers }
    );
  }

  return NextResponse.json({ clubs: data, count }, { status: 200, headers });
}

export async function POST(req: NextRequest) {
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

  const body = await req.json();
  const { name, description, logo_url } = body;
  if (!name || !description) {
    return NextResponse.json(
      { error: "Missing required fields" },

      { status: 400, headers }
    );

  }

  const { data: existing } = await supabase
    .from("organizations")
    .select("organization_id")
    .eq("name", name)
    .eq("institution_id", user.user_metadata?.institution_id)
    .eq("organization_type", "club")
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Club name already exists" },
      { status: 400, headers }

    );
  }

  const { data, error } = await supabase
    .from("organizations")
    .insert({
      name,
      description,
      logo_url,
      institution_id: user.user_metadata?.institution_id,
      created_by: user.id,
      organization_type: "club",
      status: "pending",
    })
    .select("*")
    .single();

  if (error) {

    return NextResponse.json(
      { error: error.message },
      { status: 500, headers }
    );

  }

  await supabase.from("organization_status_logs").insert({
    organization_id: data.organization_id,
    status: "pending",
    changed_at: new Date().toISOString(),
    changed_by: user.id,
  });


  return NextResponse.json({ club: data }, { status: 201, headers });

}
