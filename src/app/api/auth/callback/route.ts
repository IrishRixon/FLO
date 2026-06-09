import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Auth callback route for email verification and OAuth redirects.
 * Supabase redirects users here after:
 * - Clicking the email confirmation link
 * - Completing Google OAuth sign-in/sign-up
 *
 * This handler exchanges the auth code for a session and redirects to "/".
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore cookie setting errors during Server Component render
            }
          },
        },
      }
    );

    // Exchange the authorization code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error.message);
      // Redirect to login with detailed error
      const loginUrl = new URL('/login', requestUrl.origin);
      loginUrl.searchParams.set('error', error.message);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Successful verification — redirect to home/dashboard
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}