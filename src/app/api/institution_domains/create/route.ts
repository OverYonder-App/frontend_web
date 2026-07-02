// /app/api/institution-domains/create/route.ts
"use server"
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServerClient();

  const body = await req.json();

  const { domain, institution_id, type_category } = body;

  if (!domain || !institution_id || !type_category) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("institution_domains")
    .insert([{ domain, institution_id, type_category }])
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
