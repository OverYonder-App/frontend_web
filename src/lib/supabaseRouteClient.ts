import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database.types";

export const getSupabaseRouteHandlerClient = (req: NextRequest) => {

  const res = new NextResponse();


  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll().map(({ name, value }) => ({
            name,
            value,
          }));
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  return { supabase, headers: res.headers };
};
