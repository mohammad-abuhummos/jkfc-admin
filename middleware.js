import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("jkfc_token")?.value;
  const isLoggedIn = Boolean(token);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  if (pathname === "/login" && isLoggedIn) {
    const url = new URL("/dashboard", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
