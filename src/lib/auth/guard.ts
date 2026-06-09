import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Server-side auth guard.
 * Checks if the user is authenticated and redirects to /login if not.
 * Call this at the top of any protected page/layout Server Component.
 *
 * @returns The authenticated Supabase user object if logged in.
 */
export async function requireAuth() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}