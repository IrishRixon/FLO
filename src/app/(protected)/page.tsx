import { Dashboard } from '@/app/components/Dashboard';
import { constraints, getMonthlySpending, getTransactions } from '@/modules/dashboard/dal/dashboard.dal';
import { getIncomeForMonth } from '@/lib/supabase/queries/insights';
import { redirect } from 'next/navigation';
import { getAllCategoriesWithBudgetVsActual } from '@/modules/categories/dal/categories.dal';

export default async function HomePage() {
  const { user, startOfMonth, startOfNextMonth } = await constraints();
  if (!user) {
    redirect('/auth/login');
  }
  const [transactions, monthlySpending, monthlyIncome, categoriesWithBudgetActual] = await Promise.all([
    getTransactions(),
    getMonthlySpending(),
    getIncomeForMonth(user?.id, startOfMonth, startOfNextMonth),
    getAllCategoriesWithBudgetVsActual()
  ]);

  return <Dashboard monthlySpending={monthlySpending} transactionsWithCategory={transactions} categoriesWithBudgetActual={categoriesWithBudgetActual} monthlyIncome={monthlyIncome.total} />;
}