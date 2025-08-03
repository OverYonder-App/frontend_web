"use server";


import { getSupabaseServerClient } from "@/lib/auth";
export async function loginWithPassword(email: string, password: string) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return { user: data.user, session: data.session };
}
