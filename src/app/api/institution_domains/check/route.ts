// /app/api/institution_domains/check/route.ts
"use server"
import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/auth";

export async function GET(req: Request) {
  const supabase = await getSupabaseServerClient();

  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");

  if (!domain || typeof domain !== "string") {
    return NextResponse.json(
      { error: "Missing or invalid domain" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("institution_domains")
    .select("institution_id, domain, type_category")
    .eq("domain", domain.toLowerCase())
    .single();

  if (error || !data) {
    return NextResponse.json({ exists: false }, { status: 200 });
  }

  return NextResponse.json({ exists: true, ...data }, { status: 200 });
}
