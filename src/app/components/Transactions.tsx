"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { iconMap } from "@/iconlist/icon-list";
import { TransactionWithCategory } from "@/types";

interface TransactionsProps {
  initialTransactions: TransactionWithCategory[];
  currentPage: number;
  totalPages: number;
  total: number;
  pageSize: number;
}

function formatDateLabel(dateStr: string): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const date = new Date(dateStr + "T00:00:00");
  const dateDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffDays = Math.floor(
    (today.getTime() - dateDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

function groupByDate(
  transactions: TransactionWithCategory[]
): { dateLabel: string; items: TransactionWithCategory[] }[] {
  const grouped: Record<string, TransactionWithCategory[]> = {};

  for (const t of transactions) {
    const label = formatDateLabel(t.date);
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(t);
  }

  return Object.entries(grouped).map(([dateLabel, items]) => ({
    dateLabel,
    items,
  }));
}

export function Transactions({
  initialTransactions,
  currentPage,
  totalPages,
  total,
  pageSize,
}: TransactionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Derive categories from the full dataset (using the initial total for counts)
  const categories = useMemo(() => {
    const categoryMap = new Map<
      string,
      { name: string; icon: string; color: string; count: number }
    >();

    for (const t of initialTransactions) {
      if (!t.categories) continue;
      const cat = t.categories;
      const existing = categoryMap.get(cat.name);
      if (existing) {
        existing.count++;
      } else {
        categoryMap.set(cat.name, {
          name: cat.name,
          icon: cat.icon || "folder",
          color: cat.color || "#6B7280",
          count: 1,
        });
      }
    }

    return [
      { name: "All", count: total, icon: "folder", color: "#6B7280" },
      ...Array.from(categoryMap.values()),
    ];
  }, [initialTransactions, total]);

  // Filter transactions based on category and search
  const filteredTransactions = useMemo(() => {
    let filtered = initialTransactions;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (t) => t.categories?.name === selectedCategory
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.categories?.name.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [initialTransactions, selectedCategory, searchQuery]);

  const grouped = useMemo(() => groupByDate(filteredTransactions), [filteredTransactions]);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const qs = params.toString();
    router.push(qs ? `/transactions?${qs}` : "/transactions");
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2
          className="text-2xl font-medium mb-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Transactions
        </h2>
        <p className="text-text-secondary text-sm">
          View and manage all your transactions
        </p>
      </div>

      <div className="mb-6">
        <div className="relative mb-4">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary"
            size={18}
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-lg py-3 pl-12 pr-4 text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.name
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface text-text-secondary hover:text-foreground border border-border"
              }`}
            >
              {category.name}
              <span className="ml-1.5 opacity-70">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction list */}
      <div className="space-y-6">
        {grouped.length === 0 ? (
          <p className="text-text-secondary text-center py-12">
            No transactions found.
          </p>
        ) : (
          grouped.map((group) => (
            <div key={group.dateLabel}>
              <h3 className="text-sm font-medium text-text-secondary mb-3 px-1">
                {group.dateLabel}
              </h3>
              <div className="bg-surface rounded-xl border border-border shadow-sm divide-y divide-border">
                {group.items.map((transaction) => {
                  const iconName = transaction.categories?.icon || "folder";
                  const Icon = iconMap[iconName];
                  const color = transaction.categories?.color || "#6B7280";
                  const amount = transaction.amount;
                  const isExpense =
                    transaction.type === "expense" || amount < 0;

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-[#1E1E22] transition-colors cursor-pointer first:rounded-t-xl last:rounded-b-xl"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        {Icon ? (
                          <Icon size={18} style={{ color }} />
                        ) : (
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: color }}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {transaction.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {transaction.categories && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{
                                backgroundColor: `${color}26`,
                                color,
                              }}
                            >
                              {transaction.categories.name}
                            </span>
                          )}
                          <span className="text-xs text-text-secondary">
                            {new Date(
                              transaction.date + "T" + (transaction.created_at?.split("T")[1] || "00:00:00")
                            ).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </span>
                        </div>
                      </div>
                      <p
                        className="text-base font-medium flex-shrink-0"
                        style={{
                          fontFamily: "var(--font-mono)",
                          color: isExpense ? "#FF6B6B" : "#4ECDC4",
                        }}
                      >
                        {isExpense ? "-" : "+"}₱
                        {Math.abs(amount).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8 pb-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-surface border border-border text-text-secondary hover:text-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                // Show first, last, current, and neighbors
                if (p === 1 || p === totalPages) return true;
                if (Math.abs(p - currentPage) <= 1) return true;
                return false;
              })
              .map((p, idx, arr) => (
                <span key={p} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="px-1 text-text-secondary">...</span>
                  )}
                  <button
                    onClick={() => goToPage(p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                      p === currentPage
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface border border-border text-text-secondary hover:text-foreground"
                    }`}
                  >
                    {p}
                  </button>
                </span>
              ))}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium bg-surface border border-border text-text-secondary hover:text-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}