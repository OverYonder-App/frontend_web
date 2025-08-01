// app/api/organizations/select/route.ts
"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseRouteClient";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; org_type: string } }
) {
  const { supabase } = await getSupabaseRouteHandlerClient();

  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("institution_id", params.id)
    .eq("organization_type", params.org_type)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ organizations: data });
}
