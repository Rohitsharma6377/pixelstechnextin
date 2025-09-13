import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Log API requests to terminal
  if (pathname.startsWith("/api")) {
    const method = req.method;
    const qs = req.nextUrl.search || "";
    console.log(`[API] ${method} ${pathname}${qs}`);
  }

  // Protect admin route by ADMIN role
  if (pathname.startsWith("/admin")) {
    const cookie = req.cookies.get("token")?.value;
    try {
      if (!cookie) throw new Error("no token");
      const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "default_secret_change_me");
      const { payload } = await jwtVerify(cookie, secret, { algorithms: ["HS256"] });
      const role = String((payload as any).role || "").toLowerCase();
      if (role !== "admin") throw new Error("not admin");
    } catch {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // Protect upload route: require signed-in user
  if (pathname.startsWith("/upload")) {
    const cookie = req.cookies.get("token")?.value;
    if (!cookie) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/upload", "/api/:path*"],
};
