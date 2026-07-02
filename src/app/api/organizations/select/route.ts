// app/api/organizations/select/route.ts
"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseRouteClient";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; org_type: string }> }
) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);
  const { id, org_type } = await params;

  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("institution_id", id)
    .eq("organization_type", org_type === "group" ? "group" : "club")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers }
    );
  }

  return NextResponse.json({ organizations: data }, { headers });
}
