import { Suspense } from 'react';
import { Transactions } from '@/app/components/Transactions';
import { getAllTransactions } from '@/modules/transactions/dal/transactions.dal';

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page) || 1);
  const pageSize = 20;

  const { transactions, total } = await getAllTransactions(currentPage, pageSize);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <Suspense fallback={<div className="p-8 text-text-secondary">Loading transactions...</div>}>
      <Transactions
        initialTransactions={transactions}
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
      />
    </Suspense>
  );
}
