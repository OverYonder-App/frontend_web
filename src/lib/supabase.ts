// supabase.ts
// Browser Supabase client for client components / client-side queries.
"use client";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/database.types";

// No custom cookie adapter: @supabase/ssr's built-in document.cookie handling
// correctly encodes/decodes and chunks the (large) auth-token cookie, and
// interoperates with the server clients (auth.ts / supabaseRouteClient /
// middleware). A previous hand-rolled adapter wrote cookie values raw but read
// them back through decodeURIComponent, corrupting the chunked refresh token
// and causing "Invalid Refresh Token: Refresh Token Not Found".
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
