"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseRouteClient";

export async function GET(req: NextRequest) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);

  const { data, error } = await supabase
    .from("users")
    .select("user_id, email");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers }
    );
  }

  return NextResponse.json({ users: data }, { status: 200, headers });
}

