import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const getSupabaseRouteHandlerClient = async () => {
  const cookieStore = await cookies();

  return {
    supabase: createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () =>
            cookieStore
              .getAll()
              .map((c: { name: any; value: any }) => ({
                name: c.name,
                value: c.value,
              })),
        },
      }
    ),
  };
};
