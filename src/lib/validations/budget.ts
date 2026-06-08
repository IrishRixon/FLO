import { z } from 'zod';

/** Zod schema for creating / updating a budget */
export const createBudgetSchema = z.object({
  category_id: z
    .string()
    .uuid('Invalid category'),
  amount: z
    .number({ invalid_type_error: 'Amount must be a number' })
    .positive('Budget amount must be greater than zero')
    .max(999_999_999.99, 'Amount is too large'),
  month: z
    .string()
    .min(1, 'Month is required')
    .regex(/^\d{4}-\d{2}-01$/, 'Month must be the first day of a month (YYYY-MM-01)'),
});

/** Inferred type from the create budget schema */
export type CreateBudgetFormValues = z.infer<typeof createBudgetSchema>;
