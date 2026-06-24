import { Dashboard } from '@/app/components/Dashboard';
import { constraints, getMonthlyBudgets, getMonthlySpending, getTransactions } from '@/modules/dashboard/dal/dashboard.dal';
import { getIncomeForMonth } from '@/lib/supabase/queries/insights';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const { user, startOfMonth, startOfNextMonth } = await constraints();
  if (!user) {
    redirect('/auth/login');
  }
  const [budgetOfTheMonth, transactions, monthlySpending, monthlyIncome] = await Promise.all([
    getMonthlyBudgets(),
    getTransactions(),
    getMonthlySpending(),
    getIncomeForMonth(user?.id, startOfMonth, startOfNextMonth)
  ]);

  return <Dashboard budgetObj={budgetOfTheMonth} monthlySpending={monthlySpending} transactionsWithCategory={transactions} monthlyIncome={monthlyIncome.total} />;
}