// supabase.ts
// after login
// Calling Supabase from React components
// Performing client-side queries
import { createBrowserClient } from "@supabase/ssr";
import Cookies, { type CookieAttributes } from "js-cookie";
import type { Database } from "@/lib/database.types";

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      get(name: string) {
        return Cookies.get(name);
      },
      set(name: string, value: string, options?: CookieAttributes) {
        Cookies.set(name, value, options);
      },
      remove(name: string, options?: CookieAttributes) {
        Cookies.remove(name, options);
      },
    },
  }
);
