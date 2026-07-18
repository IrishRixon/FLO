"use client";

import * as LucideIcons from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { useEffect, useMemo, useState, useTransition } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

// ── Dynamically collect all Lucide icon components ──────────────────
// We walk the named exports of lucide-react and pick out PascalCase
// functions/objects that are actual icon components (≈ 1,500+ icons).
const iconEntries = Object.entries(LucideIcons).filter(
  ([name, exportValue]) => {
    // Icon component names always start with an uppercase letter
    if (name[0] !== name[0].toUpperCase()) return false;
    // They are functions or forwarded-ref components
    if (typeof exportValue !== "function" && typeof exportValue !== "object")
      return false;
    // Exclude known non-icon exports
    if (["Icon", "createLucideIcon", "default"].includes(name)) return false;
    // Exclude utility objects that happen to be PascalCase
    if (!name.endsWith("Icon") && name.length <= 1) return false;
    return true;
  }
);

// Sort alphabetically for a predictable list
iconEntries.sort(([a], [b]) => a.localeCompare(b));

interface IconPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "icon" | "color-type";

const PRESET_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#14b8a6", // teal
  "#3b82f6", // blue
  "#6366f1", // indigo
  "#a855f7", // purple
  "#ec4899", // pink
  "#78716c", // stone
];

export function IconPickerDialog({
  open,
  onOpenChange,
}: IconPickerDialogProps) {
  const [search, setSearch] = useState("");
  const [step, setStep] = useState<Step>("icon");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [type, setType] = useState<"expense" | "income" | null>(null);
  const [isPending, startTransition] = useTransition();

  // Reset state every time dialog opens
  useEffect(() => {
    if (open) {
      setSearch("");
      setStep("icon");
      setSelectedIcon(null);
      setName("");
      setColor("#6366f1");
      setType(null);
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!search.trim()) return iconEntries.slice(0, 100); // show first 100 when empty
    const q = search.toLowerCase();
    return iconEntries.filter(([name]) => name.toLowerCase().includes(q));
  }, [search]);

  const handleSelect = (iconName: string) => {
    console.log(iconName);
    
    setSelectedIcon(iconName);
  };

  const handleNext = () => {
    if (selectedIcon) setStep("color-type");
  };

  const handleBack = () => {
    setStep("icon");
  };

  const handleCreate = () => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/icon-picker', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name,
            icon: selectedIcon,
            color: color,
            type: type
          })
        })

        const result = await response.json()

        if (!response.ok) {
          toast.error(result.message || "Failed to create category")
          return
        }

        toast.success(result.message)
      }
      catch (error) {
        toast.error(`Error creating category: ${error}`)
      }
      onOpenChange(false);
    })
  };

  const SelectedIconComponent = selectedIcon
    ? (LucideIcons[selectedIcon as keyof typeof LucideIcons] as React.ComponentType<{
      size?: number;
      className?: string;
      style?: React.CSSProperties;
    }>)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {step === "icon" ? "Choose an Icon" : "Category Details"}
          </DialogTitle>
          <DialogDescription>
            {step === "icon"
              ? "Search for a Lucide icon to represent this category."
              : "Enter a name, pick a color, and select a category type."}
          </DialogDescription>
        </DialogHeader>

        {step === "icon" && (
          <>
            {/* Search input */}
            <Input
              placeholder="Search icons…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="mb-2 border border-border min-h-9"
            />

            {/* Icon grid */}
            <div className="flex-1 overflow-y-auto grid grid-cols-4 sm:grid-cols-5 gap-2 p-0.5">
              {filtered.length === 0 ? (
                <p className="col-span-full text-center text-sm text-muted-foreground py-8">
                  No icons found for "{search}"
                </p>
              ) : (
                filtered.map(([name, IconComponent]) => {
                  const Icon = IconComponent as React.ComponentType<{
                    size?: number;
                    className?: string;
                  }>;
                  const isSelected = selectedIcon === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => handleSelect(name)}
                      className={`flex flex-col items-center gap-4 rounded-lg p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${isSelected
                          ? "bg-primary/10 ring-2 ring-primary"
                          : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      title={name}
                    >
                      <Icon size={30} />
                      <span className="text-[10px] text-muted-foreground truncate w-full text-center leading-tight">
                        {name}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Next button — only visible when an icon is selected */}
            {selectedIcon && (
              <div className="flex justify-end pt-4 border-t border-border mt-4">
                <Button onClick={handleNext} className="gap-2">
                  Next
                  <ArrowRight size={16} />
                </Button>
              </div>
            )}
          </>
        )}

        {step === "color-type" && (
          <div className="flex flex-col gap-6">
            {/* Selected icon preview */}
            {SelectedIconComponent && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: color + "20" }}
                >
                  <SelectedIconComponent
                    size={24}
                    style={{ color }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{selectedIcon}</span>
                  <span className="text-xs text-muted-foreground">
                    Selected icon
                  </span>
                </div>
              </div>
            )}

            {/* Name input */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="min-h-9"
                autoFocus
              />
            </div>

            {/* Color picker */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-10 w-10 rounded-lg border border-border cursor-pointer bg-transparent"
                />
                <Input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="#hex"
                  className="font-mono min-h-9 w-32"
                  maxLength={7}
                />
              </div>
              {/* Preset color swatches */}
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setColor(preset)}
                    className={`h-7 w-7 rounded-full border-2 transition-all ${color === preset
                        ? "border-foreground scale-110"
                        : "border-transparent hover:scale-110"
                      }`}
                    style={{ backgroundColor: preset }}
                    title={preset}
                  />
                ))}
              </div>
            </div>

            {/* Type toggle */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Type</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setType("expense")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${type === "expense"
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType("income")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${type === "income"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                >
                  Income
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-between pt-4 border-t border-border mt-2">
              <Button variant="ghost" onClick={handleBack} className="gap-2">
                <ArrowLeft size={16} />
                Back
              </Button>
              <Button onClick={handleCreate} disabled={!type || !selectedIcon || !color}>
                Create
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}