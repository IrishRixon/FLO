'use client';

import { useEffect, useState } from 'react';
import { LayoutDashboard, Receipt, TrendingUp, LogOut, User, Tags } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { Avatar } from './ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setSupabaseUser(user);
    });
  }, []);

  const urlExceptions = ['/login', '/signup'];
  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/categories', label: 'Categories', icon: Tags },
    { href: '/transactions', label: 'Transactions', icon: Receipt },
    { href: '/insights', label: 'Insights', icon: TrendingUp },
  ];

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="flex h-screen w-screen bg-background">
      {!urlExceptions.includes(pathname) && (
        <aside className="w-60 bg-surface border-r border-sidebar-border flex flex-col">
          <div className="p-6 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <h1 className="text-xl font-medium" style={{ fontFamily: 'var(--font-display)' }}>
              Flo
            </h1>
          </div>

          <nav className="flex-1 px-3 py-4">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-120 ${
                    isActive
                      ? 'text-foreground border-l-2 border-primary bg-surface-elevated'
                      : 'text-text-secondary hover:text-foreground hover:bg-surface-elevated'
                  }`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                {supabaseUser?.user_metadata.picture ? (
                  <Avatar>
                  <AvatarImage src={supabaseUser?.user_metadata.picture}/>
                </Avatar> 
                ) : (
                  <User size={16} className="text-primary-foreground" />
                )}
               
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {supabaseUser?.user_metadata?.full_name || supabaseUser?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-text-secondary truncate">
                  {supabaseUser?.email || ''}
                </p>
              </div>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="p-1.5 hover:bg-surface-elevated rounded transition-colors disabled:opacity-50"
                title="Log out"
              >
                <LogOut size={16} className="text-text-secondary" />
              </button>
            </div>
          </div>
        </aside>
      )}

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}