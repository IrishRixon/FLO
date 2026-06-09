import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a server-side Supabase client for Server Components, Route Handlers, and Server Actions.
 * Handles reading and writing cookies appropriately.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
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
            // The `setAll` method can be called from Server Components
            // but Next.js will throw an error if you try to write cookies
            // during render. This catch block prevents crashes, and we rely
            // on middleware to refresh/set cookies on actual network requests.
          }
        },
      },
    }
  );
}
