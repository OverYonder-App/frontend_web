import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";


export async function POST(req: NextRequest) {
  const supabase = await getSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file || !file.name) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `avatar-${uuidv4()}.${fileExt}`;

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("institution_id")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { message: "User profile not found" },
      { status: 404 }
    );
  }

  const path = `${profile.institution_id}/users/${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("oy-media")
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return NextResponse.json({ message: uploadError.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("oy-media").getPublicUrl(path);

  return NextResponse.json({ url: publicUrl });
}
