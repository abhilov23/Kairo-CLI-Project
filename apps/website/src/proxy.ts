import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // ── Redirect authenticated users away from login/signup ──
  if (isLoggedIn && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  // ── Protect dashboard routes ────────────────────────────
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // All other routes (public pages, etc.) pass through
  return NextResponse.next();
});

// Match all routes except static files and Next.js internals
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
