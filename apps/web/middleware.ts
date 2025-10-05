import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  // All private routes live under (private)
  const isPrivateRoute = pathname.startsWith("/(private)");
  const isLoginPage = pathname === "/login";

  // Redirect unauthenticated users trying to access private routes
  if (!user && isPrivateRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Redirect authenticated users away from /login
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/(private)/:path*", // protect everything under (private)
    "/login", // handle login redirects
  ],
};
