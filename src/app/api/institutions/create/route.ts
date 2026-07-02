// /app/api/institutions/create/route.ts
"use server";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServerClient();
  const body = await req.json();
  const { institution_name, abbreviated_name, address, domain, type_category } =
    body;

  if (!institution_name || !abbreviated_name || !domain) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  // One SECURITY DEFINER call provisions the institution (pending), seeds its
  // roles (via trigger), registers the domain, and makes the caller its admin.
  const { data, error } = await supabase.rpc("create_institution_and_admin", {
    p_name: institution_name,
    p_abbr: abbreviated_name,
    p_address: address ?? "",
    p_domain: domain,
    p_domain_type: type_category ?? "Student",
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({ institution_id: data }, { status: 200 });
}
