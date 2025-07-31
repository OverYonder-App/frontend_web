"use server";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/auth"; // adjust this import if needed
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServerClient({ cookies });
  const { firstName, lastName, about, avatarUrl, selectedRole } =
    await req.json();

  // 1. Get the currently authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const emailDomain = user.email?.split("@")[1];
  if (!emailDomain) {
    return NextResponse.json(
      { message: "Email domain not found" },
      { status: 400 }
    );
  }

  // 2. Look up the institution by domain
  const { data: domainRow, error: domainError } = await supabase
    .from("institution_domains")
    .select("institution_id")
    .eq("domain", emailDomain)
    .single();

  if (domainError || !domainRow) {
    return NextResponse.json(
      { message: "Institution domain not recognized" },
      { status: 404 }
    );
  }

  // 3. Look up the role ID based on selected role + institution
  const { data: roleRow, error: roleError } = await supabase
    .from("roles")
    .select("role_id")
    .eq("institution_id", domainRow.institution_id)
    .eq("role_name", selectedRole)
    .single();

  if (roleError || !roleRow) {
    return NextResponse.json({ message: "Role not found" }, { status: 404 });
  }

  // 4. Update the user's profile
  const { error: updateError } = await supabase
    .from("users")
    .update({
      first_name: firstName,
      last_name: lastName,
      about,
      avatar_url: avatarUrl,
      institution_id: domainRow.institution_id,
      role_id: roleRow.role_id,
    })
    .eq("user_id", user.id);

  if (updateError) {
    return NextResponse.json({ message: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Onboarding complete" }, { status: 200 });
}
