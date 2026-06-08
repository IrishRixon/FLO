"use client";

import { useState } from 'react';
import { Search, UtensilsCrossed, ShoppingBag, Car, Heart, Home, Popcorn, Smartphone } from 'lucide-react';

const categories = [
  { name: 'All', count: 42 },
  { name: 'Food', count: 15 },
  { name: 'Transport', count: 8 },
  { name: 'Bills', count: 6 },
  { name: 'Entertainment', count: 7 },
  { name: 'Health', count: 6 },
];

const allTransactions = [
  {
    date: 'Today',
    items: [
      { id: 1, icon: UtensilsCrossed, description: 'Breakfast at The Commons', category: 'Food', amount: -285, color: '#7C6EF7', time: '9:30 AM' },
      { id: 2, icon: Car, description: 'Grab to office', category: 'Transport', amount: -120, color: '#4ECDC4', time: '8:15 AM' },
    ],
  },
  {
    date: 'Yesterday',
    items: [
      { id: 3, icon: ShoppingBag, description: 'Uniqlo online order', category: 'Shopping', amount: -1850, color: '#FFB84D', time: '6:20 PM' },
      { id: 4, icon: UtensilsCrossed, description: 'Dinner with friends', category: 'Food', amount: -680, color: '#7C6EF7', time: '7:45 PM' },
      { id: 5, icon: Popcorn, description: 'Movie tickets', category: 'Entertainment', amount: -450, color: '#FF8A80', time: '3:15 PM' },
      { id: 6, icon: Car, description: 'Grab ride home', category: 'Transport', amount: -95, color: '#4ECDC4', time: '11:30 PM' },
    ],
  },
  {
    date: 'May 14',
    items: [
      { id: 7, icon: Heart, description: 'Gym membership', category: 'Health', amount: -1200, color: '#86EFAC', time: '10:00 AM' },
      { id: 8, icon: UtensilsCrossed, description: 'Lunch meeting', category: 'Food', amount: -520, color: '#7C6EF7', time: '12:30 PM' },
      { id: 9, icon: Smartphone, description: 'Spotify Premium', category: 'Entertainment', amount: -149, color: '#FF8A80', time: '9:00 AM' },
    ],
  },
  {
    date: 'May 13',
    items: [
      { id: 10, icon: Home, description: 'Electricity bill', category: 'Bills', amount: -2400, color: '#6B7280', time: '8:00 AM' },
      { id: 11, icon: ShoppingBag, description: 'Skincare products', category: 'Shopping', amount: -890, color: '#FFB84D', time: '4:45 PM' },
      { id: 12, icon: Car, description: 'Grab to client meeting', category: 'Transport', amount: -165, color: '#4ECDC4', time: '2:00 PM' },
    ],
  },
  {
    date: 'May 12',
    items: [
      { id: 13, icon: UtensilsCrossed, description: 'Coffee and pastry', category: 'Food', amount: -180, color: '#7C6EF7', time: '3:30 PM' },
      { id: 14, icon: Popcorn, description: 'Concert tickets', category: 'Entertainment', amount: -2500, color: '#FF8A80', time: '7:00 PM' },
    ],
  },
];

export function Transactions() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-medium mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Transactions
        </h2>
        <p className="text-text-secondary text-sm">View and manage all your transactions</p>
      </div>

      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary" size={18} />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg py-3 pl-12 pr-4 text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.name
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface text-text-secondary hover:text-foreground border border-border'
              }`}
            >
              {category.name}
              <span className="ml-1.5 opacity-70">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {allTransactions.map((group) => (
          <div key={group.date}>
            <h3 className="text-sm font-medium text-text-secondary mb-3 px-1">{group.date}</h3>
            <div className="bg-surface rounded-xl border border-border shadow-sm divide-y divide-border">
              {group.items.map((transaction) => {
                const Icon = transaction.icon;
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-[#1E1E22] transition-colors cursor-pointer first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${transaction.color}20` }}
                    >
                      <Icon size={18} style={{ color: transaction.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${transaction.color}26`,
                            color: transaction.color,
                          }}
                        >
                          {transaction.category}
                        </span>
                        <span className="text-xs text-text-secondary">{transaction.time}</span>
                      </div>
                    </div>
                    <p
                      className="text-base font-medium flex-shrink-0"
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
        ))}
      </div>
    </div>
  );
}
