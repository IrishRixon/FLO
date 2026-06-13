'use client';

import useSWR from 'swr';
import { TransactionWithCategory } from '@/types';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface UseTransactionsOptions {
  initialData?: TransactionWithCategory[];
  total?: number;
  page?: number;
  pageSize?: number;
}

interface TransactionResponse {
  transactions: TransactionWithCategory[];
  total: number;
}

export function useTransactions({
  initialData,
  total: initialTotal,
  page = 1,
  pageSize = 20,
}: UseTransactionsOptions = {}) {
  const { data, error, isLoading, mutate, isValidating } = useSWR<TransactionResponse>(
    `/api/transactions?page=${page}&pageSize=${pageSize}`,
    fetcher,
    {
      fallbackData: initialData && initialTotal !== undefined
        ? { transactions: initialData, total: initialTotal }
        : undefined,
      revalidateOnFocus: false,
      revalidateOnMount: !initialData,
    }
  );

  return {
    transactions: data?.transactions ?? initialData ?? [],
    total: data?.total ?? initialTotal ?? 0,
    isLoading,
    isValidating,
    isError: !!error,
    error,
    mutate,
  };
}