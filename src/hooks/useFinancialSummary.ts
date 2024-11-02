import { useMemo } from 'react';
import { useCategories } from '@/hooks/useCategory';
import { getFilteredTransactions } from '@/hooks/useTransaction';

export function useFinancialSummary(startDate: Date, endDate: Date) {
    const { result: transactions } = getFilteredTransactions((collection) =>
        collection.find({
            selector: {
                date: {
                    $gte: startDate.toISOString(),
                    $lte: endDate.toISOString(),
                },
            },
            sort: [{ date: 'desc' }],
        })
    );

    const { result: categories } = useCategories();

    return useMemo(() => {
        const totalSummary = transactions.reduce(
            (acc, transaction) => {
                const category = categories.find(
                    (c) => c.uuid === transaction.categoryId
                );
                const amount =
                    category?.type === 'expense'
                        ? -transaction.amount
                        : transaction.amount;
                return {
                    totalIncome: acc.totalIncome + (amount > 0 ? amount : 0),
                    totalExpenses:
                        acc.totalExpenses + (amount < 0 ? -amount : 0),
                    total: acc.total + amount,
                };
            },
            {
                totalIncome: 0,
                totalExpenses: 0,
                total: 0,
            }
        );

        return {
            ...totalSummary,
            transactions,
            categories,
        };
    }, [transactions, categories]);
}
