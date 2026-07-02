"use server";

import { NextRequest, NextResponse } from "next/server";
import { createOAuth2Client } from "@/lib/googleClient";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseRouteClient";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const redirectUrl = new URL("/dashboard", req.url);
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);

  if (!code) {
    return NextResponse.redirect(redirectUrl, { headers });
  }

  try {
    const client = createOAuth2Client();
    const { tokens } = await client.getToken(code);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase.from("user_google_tokens").upsert(
        {
          user_id: user.id,
          access_token: tokens.access_token ?? null,
          refresh_token: tokens.refresh_token ?? null,
          scope: tokens.scope ?? null,
          token_type: tokens.token_type ?? null,
          expiry_date: tokens.expiry_date
            ? new Date(tokens.expiry_date).toISOString()
            : null,
        },
        { onConflict: "user_id" }
      );
    }
  } catch (e) {
    console.error(e);
  }

  return NextResponse.redirect(redirectUrl, { headers });
}
