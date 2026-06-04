'use client';

import { LayoutDashboard, Receipt, TrendingUp, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/transactions', label: 'Transactions', icon: Receipt },
    { href: '/insights', label: 'Insights', icon: TrendingUp },
  ];

  return (
    <div className="flex h-screen w-screen bg-background">
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
              <User size={16} className="text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Alex Chen</p>
              <p className="text-xs text-text-secondary truncate">alex@example.com</p>
            </div>
            <button className="p-1.5 hover:bg-surface-elevated rounded transition-colors">
              <Settings size={16} className="text-text-secondary" />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}