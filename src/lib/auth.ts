// auth.ts
// used in api routes
// Server components
// Middleware
// Server Actions
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { Database } from "./database.types";

export const getSupabaseServerClient = async (p0: unknown) => {
  const cookieStore = await cookies();
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore
            .getAll()
            .map(({ name, value }) => ({ name, value }));
        },
        setAll(cookies) {
          cookies.forEach((cookie) => {
            const { name, value, options } = cookie;
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );
};

