"use server";

import { NextRequest, NextResponse } from "next/server";
import { createOAuth2Client } from "@/lib/googleClient";

export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get("state") ?? "";
  const client = createOAuth2Client();
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar"],
    prompt: "consent",
    state,
  });
  return NextResponse.redirect(url);
}
