// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { Database } from "@/lib/database.types";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies
            .getAll()
            .map(({ name, value }) => ({ name, value }));
        },
        setAll(cookies) {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  const protectedPrefixes = ["/dashboard", "/onboarding"];
  const isProtected = protectedPrefixes.some((path) =>
    pathname.startsWith(path)
  );

  // Redirect unauthenticated user to login
  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Decode onboarding/role claims once for any authenticated, protected route.
  interface DecodedToken {
    app_metadata?: { role_type?: string; onboarding?: boolean };
  }
  const decoded = session
    ? (jwt.decode(session.access_token) as DecodedToken | null)
    : null;
  const onboarded = decoded?.app_metadata?.onboarding === true;

  // Force un-onboarded users through onboarding before any dashboard access,
  // and keep onboarded users out of the onboarding flow.
  if (session) {
    if (!onboarded && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }
    if (onboarded && pathname.startsWith("/onboarding")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // If user is logged in, check role and route
  if (session && pathname.startsWith("/dashboard")) {
    const role = decoded?.app_metadata?.role_type ?? "";

    // Define role → route mapping
    const roleRoutes: Record<string, string[]> = {
      "/dashboard/student": ["Student", "Student Leader"],
      "/dashboard/faculty": ["Faculty"],
      "/dashboard/institution-admin": ["Institution Admin"],
      "/dashboard/oy": ["OY Admin"],
    };

    // Find the route segment being accessed
    const matchedEntry = Object.entries(roleRoutes).find(([route]) =>
      pathname.startsWith(route)
    );

    if (matchedEntry) {
      const [, allowedRoles] = matchedEntry;

      if (!allowedRoles.includes(role)) {
        // Redirect user to their correct dashboard instead of unauthorized
        const targetRoute = Object.entries(roleRoutes).find(([, roles]) =>
          roles.includes(role)
        )?.[0];

        if (targetRoute) {
          return NextResponse.redirect(new URL(targetRoute, req.url));
        }

        // If role isn't matched at all, fallback to unauthorized
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};
