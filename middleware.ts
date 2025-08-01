// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { Database } from "@/lib/database.types";

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
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  const protectedRoutes = ["/dashboard", "/onboarding"];
  const isProtected = protectedRoutes.some((path) => pathname.startsWith(path));

  if (!user && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based route protection under /dashboard/*
  if (user && pathname.startsWith("/dashboard")) {
    const role = user.app_metadata?.role_type;

    const roleRoutes = {
      "/dashboard/student": ["Student", "Student Leader"],
      "/dashboard/faculty": ["Faculty"],
      "/dashboard/institution-admin": ["Institution Admin"],
      "/dashboard/oy": ["OY Admin"],
    };

    const matched = Object.entries(roleRoutes).find(([route]) =>
      pathname.startsWith(route)
    );

    if (matched) {
      const [route, allowedRoles] = matched;

      if (!allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*"],
};
