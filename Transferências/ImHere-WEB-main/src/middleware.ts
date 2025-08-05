import { NextRequest, NextResponse } from 'next/server';
import { getToken } from './utils/token';

export async function middleware(req: NextRequest) {
  const token = await getToken();
  const url = new URL(req.url);
  const currentPath = url.pathname;
  const publicRoutes = ['/', '/login', '/register', '/our-service-providers'];

  const isPublicRoute = publicRoutes.some((route) =>
    currentPath === route || currentPath.startsWith(`${route}/`)
  );

  const isAuthenticated = Boolean(token);

  if (!isPublicRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isAuthenticated && publicRoutes.includes(currentPath)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.webp|.*\\.jpg|.*\\.svg|service-worker\\.js).*)',
  ],
};
