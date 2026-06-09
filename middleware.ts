import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse } from 'next/server';

/**
 * Root middleware for Flo. Handles authentication protection for /dashboard,
 * /transactions, /budget, and /insights. Redirects authenticated users away
 * from /login and /signup.
 */
export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const path = request.nextUrl.pathname;

  // Define protected routes and auth routes
  const protectedRoutes = ['/', '/transactions', '/budget', '/insights'];
  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
  const isAuthRoute = ['/login', '/signup'].includes(path);

  // Redirect to login if user is not authenticated and tries to access a protected route
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Preserve the original URL they tried to access
    url.searchParams.set('next', path);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if user is authenticated and tries to access login/signup
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (svg, png, jpg, jpeg, gif, webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
