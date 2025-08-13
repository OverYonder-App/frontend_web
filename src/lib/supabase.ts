// supabase.ts
// after login
// Calling Supabase from React components
// Performing client-side queries
"use client"
import {
  createBrowserClient,
  type CookieOptions,
} from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      getAll() {
        return document.cookie
          .split("; ")
          .filter(Boolean)
          .map((cookie) => {
            const [name, ...value] = cookie.split("=");
            return { name, value: decodeURIComponent(value.join("=")) };
          });
      },
      setAll(cookies: { name: string; value: string; options: CookieOptions }[]) {
        cookies.forEach(({ name, value, options }) => {
          let cookieString = `${name}=${value}; path=${options?.path ?? "/"}`;
          if (options?.domain) cookieString += `; domain=${options.domain}`;
          if (options?.maxAge)
            cookieString += `; max-age=${options.maxAge}`;
          if (options?.expires)
            cookieString += `; expires=${
              options.expires instanceof Date
                ? options.expires.toUTCString()
                : new Date(options.expires).toUTCString()
            }`;
          if (options?.sameSite)
            cookieString += `; samesite=${options.sameSite}`;
          if (options?.secure) cookieString += "; secure";
          document.cookie = cookieString;
        });
      },
    },
  }
);
