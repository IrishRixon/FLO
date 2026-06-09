import { Dashboard } from '@/app/components/Dashboard';
import { requireAuth } from '@/lib/auth/guard';
import { createClient } from '@/lib/supabase/server';
import { getBudgets } from '@/modules/dashboard/dal/dashboard.dal';

export default async function HomePage() {
  await requireAuth();

  const budgets = await getBudgets();

  return <Dashboard budgetObj={budgets} />;
}
