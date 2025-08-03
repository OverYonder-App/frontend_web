// /app/api/institutions/create/route.ts
"use server"
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/auth";


export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServerClient();
  const body = await req.json();

  const { institution_name, abbreviated_name, address } = body;

  if (!institution_name || !abbreviated_name) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("institutions")
    .insert([{ institution_name, abbreviated_name, address }])
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
