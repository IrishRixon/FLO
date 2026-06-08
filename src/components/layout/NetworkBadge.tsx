'use client';

import { useState, useEffect } from 'react';

export function NetworkBadge() {
  const [isOnline, setIsOnline] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsOnline(true);
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setVisible(true);
    };

    setIsOnline(navigator.onLine);
    if (!navigator.onLine) {
      setVisible(true);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${
        isOnline
          ? 'bg-secondary/10 border-secondary/20 text-secondary'
          : 'bg-[#FFB84D]/10 border-[#FFB84D]/20 text-[#FFB84D]'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-secondary' : 'bg-[#FFB84D]'}`}
      />
      <span>{isOnline ? 'Online' : 'Offline'}</span>
    </div>
  );
}
