"use server";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServerClient();
  const { firstName, lastName, about, avatarUrl, selectedRole } =
    await req.json();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  // Role assignment + onboarding completion runs through a SECURITY DEFINER
  // function: a self-onboarding user can't read the roles table under RLS, and
  // this restricts which roles they may assign themselves.
  const { error } = await supabase.rpc("complete_user_onboarding", {
    p_first: firstName ?? "",
    p_last: lastName ?? "",
    p_about: about ?? "",
    p_avatar: avatarUrl ?? "",
    p_role: selectedRole ?? "Student",
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Onboarding complete" }, { status: 200 });
}
