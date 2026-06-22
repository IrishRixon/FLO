import { Dashboard } from '@/app/components/Dashboard';
import { getBudgets, getMonthlySpending, getTransactions } from '@/modules/dashboard/dal/dashboard.dal';

export default async function HomePage() {
  const [budgetOfTheMonth, transactions, monthlySpending] = await Promise.all([
    getBudgets(),
    getTransactions(),
    getMonthlySpending(),
  ]);
  
  return <Dashboard budgetObj={budgetOfTheMonth} monthlySpending={monthlySpending} transactionsWithCategory={transactions} />;
}