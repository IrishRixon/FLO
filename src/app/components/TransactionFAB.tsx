"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAICategory } from '@/hooks/useAICategory';
import { Plus, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { iconMap } from '@/iconlist/icon-list';
import { Category } from '@/types';
import { toast } from 'sonner';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/app/components/ui/form';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

const fabFormSchema = z.object({
  type: z.enum(['expense', 'income']),
  description: z
    .string()
    .min(3, 'Description should be atleast 3 characters')
    .max(200, 'Description must be 200 characters or less'),
  amount: z
    .number()
    .positive('Amount must be greater than zero')
    .max(999_999_999.99, 'Amount is too large'),
  date: z
    .string()
    .min(1, 'Date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  category: z.string().min(1, 'Please select a category'),
});

type FabFormValues = z.infer<typeof fabFormSchema>;

interface TransactionFABProps {
  onSuccess?: () => void;
}

export function TransactionFAB({ onSuccess }: TransactionFABProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Ref to store the type field's onChange handler for programmatic updates
  const typeOnChangeRef = useRef<(...args: any[]) => void>(() => {});

  const form = useForm<FabFormValues>({
    resolver: zodResolver(fabFormSchema),
    defaultValues: {
      type: 'expense',
      description: '',
      amount: '' as unknown as number,
      date: new Date().toISOString().split('T')[0],
      category: '',
    },
  });

  const description = form.watch('description');
  const selectedType = form.watch('type');

  // Fetch categories from API on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    }
    loadCategories();
  }, []);

  const {
    suggestion: suggestedCategory,
    confidence,
    confidencePercent,
    suggestedType,
    typeConfidence,
    typeConfidencePercent,
    isModelLoading,
    isClassifying,
  } = useAICategory(description, categories, {
    debounceMs: 600,
    minLength: 4,
    confidenceThreshold: 0.35,
    typeConfidenceThreshold: 0.30,
  });

  // Auto-fill category when suggestion arrives
  useEffect(() => {
    if (suggestedCategory) {
      form.setValue('category', suggestedCategory.name);
    }
  }, [suggestedCategory, form]);

  // Auto-fill type when AI suggests expense/income
  useEffect(() => {
    if (suggestedType) {
      typeOnChangeRef.current(suggestedType);
    }
  }, [suggestedType]);

  const handleSave = async (data: FabFormValues) => {
    setIsSaving(true);

    try {
      // Resolve category name to category_id
      const matchedCategory = categories.find((c) => c.name === data.category);
      if (!matchedCategory) {
        toast.error('Selected category not found');
        setIsSaving(false);
        return;
      }

      const payload = {
        category_id: matchedCategory.id,
        type: data.type,
        amount: data.amount,
        description: data.description,
        date: data.date,
        ai_category_suggestion: suggestedCategory?.name ?? null,
        ai_confidence: confidence > 0 ? confidence : null,
      };

      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to save transaction');
      }

      toast.success('Transaction saved');
      setIsOpen(false);
      form.reset();
      router.refresh();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to save transaction:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save transaction');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
            }}
            className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl shadow-2xl z-50 max-w-md mx-auto"
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3 mb-4" />

            <div className="px-6 pb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">New entry</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-surface-elevated rounded-lg transition-colors"
                >
                  <X size={20} className="text-text-secondary" />
                </button>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => {
                      typeOnChangeRef.current = field.onChange;
                      return (
                        <FormItem>
                          <FormLabel className="text-sm text-text-secondary">
                            Type
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="bg-background border-border h-12">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="expense">
                                  <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#FF6B6B]" />
                                    Expense
                                  </span>
                                </SelectItem>
                                <SelectItem value="income">
                                  <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#4ECDC4]" />
                                    Income
                                  </span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-text-secondary">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="What did you spend on?"
                            className="bg-background border-border text-lg h-12"
                            autoFocus
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />

                        <AnimatePresence mode="wait">
                          {/* Model loading for first time — only shows once ever */}
                          {isModelLoading && (
                            <motion.div
                              key="model-loading"
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              className="mt-3 flex items-center gap-2 px-3 py-2 bg-surface-elevated border border-border rounded-lg"
                            >
                              <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                              <span className="text-xs text-text-secondary">
                                Loading AI model for the first time...
                              </span>
                            </motion.div>
                          )}

                          {/* Classifying — model loaded, inference running */}
                          {isClassifying && !isModelLoading && (
                            <motion.div
                              key="classifying"
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              className="mt-3 flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg"
                            >
                              <Sparkles size={14} className="text-primary animate-pulse" />
                              <span className="text-xs text-primary">AI is thinking...</span>
                            </motion.div>
                          )}

                          {/* Suggestion ready */}
                          {suggestedCategory && !isClassifying && !isModelLoading && (
                            <motion.div
                              key="suggestion"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="mt-3 flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg"
                            >
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: `${suggestedCategory.color}20` }}
                              >
                                {(() => {
                                  const Icon = iconMap[suggestedCategory.icon];
                                  return Icon ? (
                                    <Icon size={14} style={{ color: suggestedCategory.color }} />
                                  ) : (
                                    <div className="w-3 h-3 rounded" style={{ backgroundColor: suggestedCategory.color }} />
                                  );
                                })()}
                              </div>
                              <span className="text-sm text-foreground font-medium">
                                {suggestedCategory.name}
                              </span>
                              <span className="text-xs text-primary ml-auto">
                                {confidencePercent} match
                              </span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-text-secondary">
                          Amount
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-text-secondary z-10"
                              style={{ fontFamily: 'var(--font-mono)' }}
                            >
                              ₱
                            </span>
                            <Input
                              type="number"
                              placeholder="0"
                              className="bg-background border-border text-2xl h-14 pl-10"
                              style={{ fontFamily: 'var(--font-mono)' }}
                              {...field}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                              value={field.value ?? ''}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-text-secondary">
                          Category
                        </FormLabel>
                        <FormControl>
                          {categoriesLoading ? (
                            <div className="grid grid-cols-3 gap-2">
                              {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                  key={i}
                                  className="p-3 rounded-lg border border-border bg-background animate-pulse"
                                >
                                  <div className="w-8 h-8 bg-border rounded-full mx-auto mb-1" />
                                  <div className="h-3 bg-border rounded mx-auto w-12" />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 gap-2 max-h-55 overflow-y-auto no-scrollbar">
                              {categories.map((cat) => {
                                const Icon = iconMap[cat.icon];
                                return (
                                  <button
                                    key={cat.name}
                                    type="button"
                                    onClick={() => field.onChange(cat.name)}
                                    className={`p-3 rounded-lg border transition-all ${
                                      field.value === cat.name
                                        ? 'border-primary bg-primary/10'
                                        : 'border-border bg-background hover:bg-surface-elevated'
                                    }`}
                                  >
                                    <div className="flex items-center justify-center mb-1">
                                      <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: `${cat.color}20` }}
                                      >
                                        {Icon ? (
                                          <Icon size={18} style={{ color: cat.color }} />
                                        ) : (
                                          <div
                                            className="w-4 h-4 rounded"
                                            style={{ backgroundColor: cat.color }}
                                          />
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-xs text-foreground">{cat.name}</div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm text-text-secondary">
                          Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="bg-background border-border"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-medium"
                    disabled={!form.formState.isValid || isSaving}
                  >
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      'Save entry'
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-7 right-7 px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-medium transition-all z-30 ${
          selectedType === 'income'
            ? 'bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white'
            : 'bg-primary hover:bg-primary/90 text-primary-foreground'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={{
          boxShadow: [
            '0 4px 16px rgba(124, 110, 247, 0.3)',
            '0 4px 24px rgba(124, 110, 247, 0.5)',
            '0 4px 16px rgba(124, 110, 247, 0.3)',
          ],
        }}
        transition={{
          boxShadow: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        }}
      >
        <Plus size={20} />
        <span>Add</span>
      </motion.button>
    </>
  );
}