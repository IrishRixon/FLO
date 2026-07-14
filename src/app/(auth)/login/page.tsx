import { Suspense } from 'react';
import { LoginPage } from '@/modules/log-in/pages/login.page';

export const dynamic = 'force-dynamic';

export default async function LoginRoutePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0F0F10]" />}>
      <LoginPage />
    </Suspense>
  );
}