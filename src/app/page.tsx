import { Dashboard } from '@/app/components/Dashboard';
import { requireAuth } from '@/lib/auth/guard';
import { getBudgets, getMonthlySpending, getTransactions } from '@/modules/dashboard/dal/dashboard.dal';

export default async function HomePage() {
  await requireAuth();

  const [budgetOfTheMonth, transactions, monthlySpending] = await Promise.all([
    getBudgets(),
    getTransactions(),
    getMonthlySpending(),
  ]);
  
  return <Dashboard budgetObj={budgetOfTheMonth} monthlySpending={monthlySpending} transactionsWithCategory={transactions} />;
}
