import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();

  const { pathname } = request.nextUrl;

  // Rotas de autenticação (login, register, etc)
  const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Landing page - só para usuários não autenticados
  const isLandingPage = pathname === "/";

  // Se usuário autenticado tentar acessar rotas de auth ou landing page, redirecionar para tasks
  if ((isAuthRoute || isLandingPage) && session) {
    return NextResponse.redirect(new URL("/tasks", request.url));
  }

  // Páginas públicas que podem ser acessadas por qualquer um (autenticado ou não)
  const publicRoutes = ["/stats", "/faq", "/help"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Se for rota pública, permitir acesso (com ou sem sessão)
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Se for rota de auth ou landing page (e usuário não autenticado), permitir acesso
  if (isAuthRoute || isLandingPage) {
    return NextResponse.next();
  }

  // Rotas protegidas
  const protectedRoutes = ["/app", "/tasks"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Se for rota protegida e não tiver sessão, redirecionar para login
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
