// app/api/institutions/check/route.ts
"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseRouteClient";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);

  const { data, error } = await supabase
    .from("institutions")
    .select("*")
    .eq("institution_id", params.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers }
    );
  }

  return NextResponse.json({ institution: data }, { headers });
}
