import { z } from 'zod';

/** Zod schema for creating a new transaction */
export const createTransactionSchema = z.object({
  description: z
    .string()
    .min(1, 'Description is required')
    .max(200, 'Description must be 200 characters or less'),
  amount: z
    .number({ error: 'Amount must be a number' })
    .positive('Amount must be greater than zero')
    .max(999_999_999.99, 'Amount is too large'),
  date: z
    .string()
    .min(1, 'Date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  type: z.enum(['expense', 'income']),
  category_id: z.uuid('Invalid category'),
  notes: z
    .string()
    .max(500, 'Notes must be 500 characters or less')
    .optional()
    .or(z.literal('')),
});

/** Inferred type from the create transaction schema */
export type CreateTransactionFormValues = z.infer<typeof createTransactionSchema>;

/** Schema for editing an existing transaction (all fields optional except id) */
export const updateTransactionSchema = createTransactionSchema.partial().extend({
  id: z.string().uuidv4({ version: 'v4', message: 'Invalid transaction ID' }),
});

export type UpdateTransactionFormValues = z.infer<typeof updateTransactionSchema>;
