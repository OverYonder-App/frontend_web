"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseRouteClient";
import { getAuthContext } from "@/lib/serverAuth";

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
  const { name, description, logo_url } = body;
  const orgType: "club" | "group" =
    body.organization_type === "group" ? "group" : "club";

  const auth = await getAuthContext(supabase);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers });
  }
  if (!name) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400, headers }
    );
  }
  if (!auth.institutionId) {
    return NextResponse.json(
      { error: "No institution assigned" },
      { status: 400, headers }
    );
  }

  // Groups are self-serve (active immediately); clubs created by students need
  // approval (pending); admins create approved orgs directly.
  const isAdmin =
    auth.roleType === "Institution Admin" || auth.roleType === "OY Admin";
  const status: "approved" | "pending" =
    isAdmin || orgType === "group" ? "approved" : "pending";

  const { data, error } = await supabase
    .from("organizations")
    .insert([
      {
        name,
        description: description ?? "",
        institution_id: auth.institutionId,
        logo_url: logo_url ?? null,
        organization_type: orgType,
        created_by: auth.userId,
        approved_by: auth.userId,
        status,
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

  // Make the creator the executive member so it shows up in their groups and
  // grants management rights. Best-effort: the org already exists if this fails.
  await supabase.from("org_members").insert({
    org_id: data.organization_id,
    user_id: auth.userId,
    role: "President",
    is_executive: true,
  });

  return NextResponse.json({ organization: data }, { status: 201, headers });
}

