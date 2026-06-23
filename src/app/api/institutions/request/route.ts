// /app/api/institutions/request/route.ts
"use server";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServerClient();
  const { directorEmail } = await req.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  // Trust the authenticated user's email rather than client-supplied values.
  const userEmail = user.email ?? "";
  const emailDomain = userEmail.split("@")[1] ?? null;

  const { error } = await supabase.from("institution_requests").insert({
    requested_by: user.id,
    user_email: userEmail,
    email_domain: emailDomain,
    director_email: directorEmail || null,
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Request submitted" }, { status: 200 });
}
