"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { iconMap } from "@/iconlist/icon-list";
import { CategoriesWithBudgetVsActual } from "@/types";

function formatMoney(amount: number): string {
  return `₱${Math.abs(amount).toLocaleString()}`;
}

interface EditDialogProps {
  category: CategoriesWithBudgetVsActual | null;
  open: boolean;
  onClose: () => void;
}

export function EditBudgetDialog({ category, open, onClose }: EditDialogProps) {
  const router = useRouter();
  const [value, setValue] = useState(
    category?.budgetVsActual.budget_amount.toString() ?? "0"
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset value when category changes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) onClose();
    if (isOpen && category) {
      setValue(category.budgetVsActual.budget_amount.toString());
    }
  };

  const handleSave = async () => {
    if (!category) return;

    const parsed = parseFloat(value);
    if (isNaN(parsed) || parsed < 0) return;

    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Authentication required");
      }

      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const startOfMonth = `${year}-${String(month + 1).padStart(2, "0")}-01`;
      const startOfNextMonth = `${year}-${String(month + 2).padStart(2, "0")}-01`;
      // Check if a budget row already exists for this category + month
      const { data: existingBudget } = await supabase
        .from("budgets")
        .select("id")
        .eq("category_id", category.id)
        .eq("user_id", user.id)
        .gte("month", startOfMonth)
        .lt("month", startOfNextMonth)
        .maybeSingle();

      if (existingBudget) {
        // Update existing
        const { error: updateError } = await supabase
          .from("budgets")
          .update({ amount: parsed })
          .eq("id", existingBudget.id);

        if (updateError) throw updateError;
      } else {
        // Insert new
        const { error: insertError } = await supabase.from("budgets").insert({
          category_id: category.id,
          user_id: user.id,
          amount: parsed,
          month: startOfMonth,
        });

        if (insertError) throw insertError;
      }

      router.refresh();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save budget";
      console.error("Error saving budget:", err);
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") onClose();
  };

  if (!category) return null;

  const Icon = iconMap[category.icon];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm ">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${category.color}20` }}
            >
              {Icon && <Icon size={18} style={{ color: category.color }} />}
            </div>
            <div>
              <DialogTitle className="text-base font-medium text-foreground">
                Set Budget
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {category.name}
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <label className="block text-xs text-muted-foreground mb-2 tracking-wide uppercase">
            Monthly Budget
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              ₱
            </span>
            <input
              type="number"
              min="0"
              step="10"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full pl-8 pr-4 py-3 rounded-xl bg-surface-elevated border border-border text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              style={{ fontFamily: "var(--font-mono)" }}
            />
          </div>
        </div>

        {error && (
          <p className="text-xs text-destructive mb-2">{error}</p>
        )}

        <p className="text-xs text-muted-foreground mb-4">
          Currently spent:{" "}
          <span
            style={{ fontFamily: "var(--font-mono)", color: category.color }}
          >
            {formatMoney(category.budgetVsActual.spent_amount)}
          </span>
        </p>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 px-4 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? (
              <span className="animate-spin w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full" />
            ) : (
              <Check size={14} />
            )}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}