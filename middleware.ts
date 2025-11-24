import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();

  const { pathname } = request.nextUrl;

  // Permitir acesso às rotas de autenticação sem sessão
  const publicRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Se for rota pública, permitir acesso
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Rotas protegidas
  const protectedRoutes = ["/app", "/tasks"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
