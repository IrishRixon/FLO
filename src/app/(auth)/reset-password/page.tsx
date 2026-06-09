import { Suspense } from 'react';
import { ResetPasswordPage } from '@/modules/reset-password/pages/reset-password.page';

export default function ResetPasswordRoutePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0F0F10]" />}>
      <ResetPasswordPage />
    </Suspense>
  );
}