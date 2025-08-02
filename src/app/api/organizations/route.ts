"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseRouteClient";

export async function GET(req: NextRequest) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);
  const { searchParams } = new URL(req.url);
  const orgType = searchParams.get("type") ?? "club";

  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("organization_type", orgType);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers }
    );
  }

  return NextResponse.json({ organizations: data }, { status: 200, headers });
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

  const { data, error } = await supabase
    .from("organizations")
    .insert([
      {
        name,
        description,
        institution_id,
        logo_url,
        organization_type: "club",
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

