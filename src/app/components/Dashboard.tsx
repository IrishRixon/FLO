"use client";

import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Budget, MonthlyBudget, MonthlySpending, TransactionWithCategory } from '@/types';
import { iconMap } from '@/iconlist/icon-list';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { DashboardCard } from '@/app/components/dashboard-card';

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getMonth()]} ${date.getDate()}`;
}

function getDaysLeftInMonth(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  return lastDay - now.getDate();
}

function getTotalSpent(transactions: TransactionWithCategory[] | null): number {
  if (!transactions) return 0;
  return transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

function getSpendingData(transactions: TransactionWithCategory[] | null): { date: string; amount: number }[] {
  if (!transactions) return [];

  const grouped: Record<string, number> = {};
  transactions.forEach(t => {
    const label = formatDateLabel(t.date);
    grouped[label] = (grouped[label] || 0) + Math.abs(t.amount);
  });

  return Object.entries(grouped)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => {
      const parseDate = (s: string) => {
        const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
        const [mon, day] = s.split(' ');
        return new Date(2026, months[mon], parseInt(day)).getTime();
      };
      return parseDate(a.date) - parseDate(b.date);
    });
}

interface Props {
  budgetObj: MonthlyBudget | null;
  transactionsWithCategory: TransactionWithCategory[] | null;
  monthlySpending: MonthlySpending[] | null;
  monthlyIncome: number;
}

export function Dashboard({ budgetObj, monthlySpending, transactionsWithCategory, monthlyIncome }: Props) {
  const transactionsExpense = transactionsWithCategory?.filter((t) => t.type === "expense");
  const totalSpent = getTotalSpent(transactionsExpense || null);
  const spendingData = getSpendingData(transactionsExpense || null);
  const budget = budgetObj?.budget || 0;
  const daysLeft = getDaysLeftInMonth();
  const dailyBudget = daysLeft > 0 ? Math.round((budget - totalSpent) / daysLeft) : 0;

  const biggestCategory = monthlySpending && monthlySpending.length > 0
    ? monthlySpending.reduce((max, curr) => curr.total > max.total ? curr : max, monthlySpending[0])
    : null;

  const categoryData = (monthlySpending || []).map(ms => ({
    name: ms.category_name,
    value: ms.total,
    color: ms.category_color,
  }));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Dashboard
        </h2>
        <p className="text-text-secondary text-sm">Track your spending and stay on budget</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <DashboardCard>
          <p className="text-text-secondary text-sm mb-2">Spent this month</p>
          <p className="text-4xl font-medium mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
            ₱{totalSpent.toLocaleString()}
          </p>
          <p className="text-text-secondary text-sm">of ₱{budget?.toLocaleString()} budget</p>
        </DashboardCard>

        <DashboardCard>
          <p className="text-text-secondary text-sm mb-2">Income</p>
          <div className="flex items-center gap-3 mb-1">
            <p className="text-4xl font-medium mb-1 text-[#4ECDC4]" style={{ fontFamily: 'var(--font-mono)' }}>₱{monthlyIncome.toLocaleString() || 'N/A'}</p>
          </div>
        </DashboardCard>

        <DashboardCard>
          <p className="text-text-secondary text-sm mb-2">Biggest category</p>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: biggestCategory?.category_color || '#6B7280' }}></div>
            <p className="text-xl font-medium">{biggestCategory?.category_name || 'N/A'}</p>
          </div>
          <p className="text-text-secondary text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
            ₱{(biggestCategory?.total || 0).toLocaleString()}
          </p>
        </DashboardCard>

        <DashboardCard>
          <p className="text-text-secondary text-sm mb-2">Days left</p>
          <p className="text-4xl font-medium mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
            {daysLeft}
          </p>
          <p className="text-text-secondary text-sm">₱{dailyBudget} daily budget</p>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <DashboardCard title="Spending over time" className="col-span-2">
          {spendingData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={spendingData}>
                <defs>
                  <linearGradient id="dashboardSpendingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C6EF7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C6EF7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="#4A4A4A"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#4A4A4A"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₱${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#242428',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '8px',
                    color: '#F0EFE9',
                  }}
                  formatter={(value: number) => [`₱${value}`, 'Amount']}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#4ECDC4"
                  strokeWidth={2}
                  fill="url(#dashboardSpendingGradient)"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[240px] text-text-secondary text-sm">
              No spending data for this month
            </div>
          )}
        </DashboardCard>

        <DashboardCard
          title="By category"
          action={
            <Link href={"/categories"} className='cursor-pointer hover:opacity-50'>
              <ChevronRight />
            </Link>
          }
        >
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry) => (
                      <Cell key={`pie-cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#242428',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '8px',
                      color: '#F0EFE9',
                    }}
                    formatter={(value: number) => `₱${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {categoryData.slice(0, 3).map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                      <span className="text-text-secondary">{cat.name}</span>
                    </div>
                    <span className="text-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                      ₱{cat.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-text-secondary text-sm">
              No category data
            </div>
          )}
        </DashboardCard>
      </div>

      <DashboardCard title="Recent transactions">
        {transactionsWithCategory && transactionsWithCategory.length > 0 ? (
          <div className="space-y-1">
            {transactionsWithCategory.map((transaction) => {

              const Icon = iconMap[transaction.categories?.icon];
              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-[#1E1E22] transition-colors cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${transaction.categories?.color}20` }}
                  >
                    {Icon && <Icon size={18} style={{ color: transaction.categories?.color }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                    <p className="text-xs text-text-secondary">{formatDateLabel(transaction.date)}</p>
                  </div>
                  <p
                    className="text-base font-medium"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      color: transaction.type === 'expense' ? '#FF6B6B' : '#4ECDC4',
                    }}
                  >
                    {transaction.type === 'expense' ? '-' : '+'}₱{Math.abs(transaction.amount).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[100px] text-text-secondary text-sm">
            No transactions this month
          </div>
        )}
      </DashboardCard>
    </div>
  );
}