import { useMemo } from 'react';
import { useCategories } from '@/hooks/useCategory';
import { getFilteredTransactions } from '@/hooks/useTransaction';
import { generateDates } from '@/packages/cron/generator';
import { parseCronExpression } from '@/packages/cron/parser';

export function useFinancialSummary(startDate: Date, endDate: Date) {
    const { result } = getFilteredTransactions((collection) =>
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

    const transactions = useMemo(() => {
        return [
            ...result,
            ...Array.from(
                // Cannot directly use map() on Iterator, not supported in Safari
                generateDates(
                    // every monday at 10:30 AM but not on march
                    parseCronExpression('30 10 */3 */2 *'),
                    startDate,
                    endDate
                )
            ).map((date) => ({
                amount: 100,
                categoryId: '48f67c28-4c6a-4bb1-b533-49db0f1a190f',
                date: date.toISOString(),
                note: 'Every Monday',
                uuid: crypto.randomUUID(),
            })),
            ...Array.from(
                generateDates(
                    // every 27th of the month
                    parseCronExpression('0 0 31 * *'),
                    startDate,
                    endDate
                )
            ).map((date) => ({
                amount: 5700,
                categoryId: '6p5o4n3m-2l1k-0j9i-8h7g-6f5e4d3c2b1a',
                date: date.toISOString(),
                note: 'Salary',
                uuid: crypto.randomUUID(),
            })),
        ].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }, [result]);

    const { result: categories } = useCategories();
    const categoryMap = useMemo(() => {
        return new Map(categories.map((category) => [category.uuid, category]));
    }, [categories]);

    return useMemo(() => {
        const totalSummary = transactions.reduce(
            (acc, transaction) => {
                const category = categoryMap.get(transaction.categoryId);
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
            categories: categoryMap,
        };
    }, [transactions, categoryMap]);
}
