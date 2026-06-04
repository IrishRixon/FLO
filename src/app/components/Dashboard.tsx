import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, Calendar, UtensilsCrossed, ShoppingBag, Car, Heart, Home } from 'lucide-react';

const spendingData = [
  { id: 1, date: 'Apr 16', amount: 850 },
  { id: 2, date: 'Apr 17', amount: 420 },
  { id: 3, date: 'Apr 18', amount: 1250 },
  { id: 4, date: 'Apr 19', amount: 680 },
  { id: 5, date: 'Apr 20', amount: 920 },
  { id: 6, date: 'Apr 21', amount: 1580 },
  { id: 7, date: 'Apr 22', amount: 750 },
  { id: 8, date: 'Apr 23', amount: 1100 },
  { id: 9, date: 'Apr 24', amount: 890 },
  { id: 10, date: 'Apr 25', amount: 1340 },
  { id: 11, date: 'Apr 26', amount: 620 },
  { id: 12, date: 'Apr 27', amount: 980 },
  { id: 13, date: 'Apr 28', amount: 1450 },
  { id: 14, date: 'Apr 29', amount: 720 },
  { id: 15, date: 'Apr 30', amount: 1200 },
  { id: 16, date: 'May 1', amount: 850 },
];

const categoryData = [
  { id: 1, name: 'Food', value: 8500, color: '#7C6EF7' },
  { id: 2, name: 'Transport', value: 3200, color: '#4ECDC4' },
  { id: 3, name: 'Shopping', value: 5600, color: '#FFB84D' },
  { id: 4, name: 'Entertainment', value: 2800, color: '#FF8A80' },
  { id: 5, name: 'Bills', value: 4200, color: '#6B7280' },
  { id: 6, name: 'Health', value: 1500, color: '#86EFAC' },
];

const transactions = [
  { id: 1, category: 'Food', icon: UtensilsCrossed, description: 'Breakfast at The Commons', date: 'Today, 9:30 AM', amount: -285, color: '#7C6EF7' },
  { id: 2, category: 'Transport', icon: Car, description: 'Grab to office', date: 'Today, 8:15 AM', amount: -120, color: '#4ECDC4' },
  { id: 3, category: 'Shopping', icon: ShoppingBag, description: 'Uniqlo online order', date: 'Yesterday, 6:20 PM', amount: -1850, color: '#FFB84D' },
  { id: 4, category: 'Food', icon: UtensilsCrossed, description: 'Dinner with friends', date: 'Yesterday, 7:45 PM', amount: -680, color: '#7C6EF7' },
  { id: 5, category: 'Health', icon: Heart, description: 'Gym membership', date: 'May 14', amount: -1200, color: '#86EFAC' },
  { id: 6, category: 'Bills', icon: Home, description: 'Electricity bill', date: 'May 13', amount: -2400, color: '#6B7280' },
];

export function Dashboard() {
  const totalSpent = 18600;
  const budget = 25000;
  const biggestCategory = categoryData[0];
  const daysLeft = 15;
  const dailyBudget = Math.round((budget - totalSpent) / daysLeft);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Dashboard
        </h2>
        <p className="text-text-secondary text-sm">Track your spending and stay on budget</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-surface rounded-xl p-6 border border-border shadow-sm">
          <p className="text-text-secondary text-sm mb-2">Spent this month</p>
          <p className="text-4xl font-medium mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
            ₱{totalSpent.toLocaleString()}
          </p>
          <p className="text-text-secondary text-sm">of ₱{budget.toLocaleString()} budget</p>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border shadow-sm">
          <p className="text-text-secondary text-sm mb-2">Biggest category</p>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: biggestCategory.color }}></div>
            <p className="text-xl font-medium">{biggestCategory.name}</p>
          </div>
          <p className="text-text-secondary text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
            ₱{biggestCategory.value.toLocaleString()}
          </p>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border shadow-sm">
          <p className="text-text-secondary text-sm mb-2">Days left</p>
          <p className="text-4xl font-medium mb-1" style={{ fontFamily: 'var(--font-mono)' }}>
            {daysLeft}
          </p>
          <p className="text-text-secondary text-sm">₱{dailyBudget} daily budget</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-surface rounded-xl p-6 border border-border shadow-sm">
          <h3 className="text-lg font-medium mb-4">Spending over time</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={spendingData}>
              <defs>
                <linearGradient id="dashboardSpendingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C6EF7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#7C6EF7" stopOpacity={0}/>
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
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border shadow-sm">
          <h3 className="text-lg font-medium mb-4">By category</h3>
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
        </div>
      </div>

      <div className="bg-surface rounded-xl p-6 border border-border shadow-sm">
        <h3 className="text-lg font-medium mb-4">Recent transactions</h3>
        <div className="space-y-1">
          {transactions.map((transaction) => {
            const Icon = transaction.icon;
            return (
              <div
                key={transaction.id}
                className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-[#1E1E22] transition-colors cursor-pointer"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${transaction.color}20` }}
                >
                  <Icon size={18} style={{ color: transaction.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                  <p className="text-xs text-text-secondary">{transaction.date}</p>
                </div>
                <p
                  className="text-base font-medium"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    color: transaction.amount < 0 ? '#FF6B6B' : '#4ECDC4',
                  }}
                >
                  {transaction.amount < 0 ? '-' : '+'}₱{Math.abs(transaction.amount).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
