import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { SESSION_COOKIE } from "./lib/auth";

const SECRET = () =>
  new TextEncoder().encode(process.env.SESSION_SECRET ?? "cartabl-default-secret");

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;

  let role: string | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, SECRET());
      if (typeof payload.role === "string") role = payload.role;
    } catch {
      role = null;
    }
  }

  const isAdmin = role === "ADMIN";
  const loginUrl = (path: string) => {
    const url = req.nextUrl.clone();
    url.pathname = "/compte/connexion";
    url.searchParams.set("next", path);
    return url;
  };

  if (pathname.startsWith("/marchand") && role !== "SELLER" && !isAdmin) {
    return NextResponse.redirect(loginUrl(pathname));
  }
  if (pathname.startsWith("/livreur") && role !== "DELIVERY" && !isAdmin) {
    return NextResponse.redirect(loginUrl(pathname));
  }
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(loginUrl(pathname));
  }
  const isPublicAccount =
    pathname === "/compte/connexion" || pathname === "/compte/inscription";
  if (pathname.startsWith("/compte") && !isPublicAccount && !role) {
    return NextResponse.redirect(loginUrl(pathname));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/marchand/:path*", "/livreur/:path*", "/admin/:path*", "/compte/:path*"],
};
