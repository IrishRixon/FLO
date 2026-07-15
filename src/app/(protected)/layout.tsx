import { requireAuth } from '@/lib/auth/guard';
import { TransactionFAB } from '@/app/components/TransactionFAB';
import { ChatbotFAB } from '@/components/chatbot/ChatbotFAB';

export const dynamic = 'force-dynamic';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

/**
 * Route group layout that applies auth protection to all routes inside (protected).
 * This avoids duplicating `requireAuth()` in every individual page file.
 */
export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  await requireAuth();
  return (
    <>
      {children}
      <TransactionFAB />
      <ChatbotFAB />
    </>
  );
}
