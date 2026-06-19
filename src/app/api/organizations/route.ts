"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseRouteClient";

const PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);
  const { searchParams } = new URL(req.url);
  const typeParam =
    searchParams.get("type") ?? searchParams.get("organization_type") ?? "club";
  const orgType: "club" | "group" = typeParam === "group" ? "group" : "club";
  const page = Number(searchParams.get("page") ?? "1");
  const search = searchParams.get("q");
  const sort = searchParams.get("sort") ?? "created_at";
  const order = searchParams.get("order") ?? "desc";
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("organizations")
    .select("*", { count: "exact" })
    .eq("organization_type", orgType);

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error, count } = await query
    .order(sort, { ascending: order !== "desc" })
    .range(from, to);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers }
    );
  }

  return NextResponse.json({ organizations: data, count }, {
    status: 200,
    headers,
  });
}

export async function POST(req: NextRequest) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);
  const body = await req.json();
  const { name, description, institution_id, logo_url } = body;

  if (!name || !institution_id) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400, headers }
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers }
    );
  }

  const { data, error } = await supabase
    .from("organizations")
    .insert([
      {
        name,
        description: description ?? "",
        institution_id,
        logo_url,
        organization_type: "club" as const,
        created_by: user.id,
        approved_by: user.id,
      },
    ])
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers }
    );
  }

  return NextResponse.json({ organization: data }, { status: 201, headers });
}

