import { useMemo } from 'react';
import { useCategories } from '@/hooks/useCategory';
import { getFilteredTransactions } from '@/hooks/useTransaction';
import { generateDates } from '@/packages/cron/generator';
import { parseCronExpression } from '@/packages/cron/parser';
import { getRecurrencesForPeriod } from '@/hooks/useRecurrence';
import { v5 as uuidv5 } from 'uuid';
import { Transaction } from '@/stores/schemas/transaction';
import { Recurrence } from '@/stores/schemas/recurrence';
import { Category } from '@/stores/schemas/category';

// Utility to calculate financial summary
function calculateFinancialSummary(
    transactions: Transaction[],
    categoryMap: Map<string, Category>
) {
    return transactions.reduce(
        (acc, transaction) => {
            const category = categoryMap.get(transaction.categoryId);
            const amount =
                category?.type === 'expense'
                    ? -transaction.amount
                    : transaction.amount;

            return {
                totalIncome: acc.totalIncome + (amount > 0 ? amount : 0),
                totalExpenses: acc.totalExpenses + (amount < 0 ? -amount : 0),
                total: acc.total + amount,
            };
        },
        { totalIncome: 0, totalExpenses: 0, total: 0 }
    );
}

// Utility to generate recurring transactions for a specific period
function generateRecurringTransactions(
    recurrences: Recurrence[],
    startDate: Date,
    endDate: Date
): Transaction[] {
    return recurrences.flatMap((recurrence) => {
        const cronDates = generateDates(
            parseCronExpression(recurrence.cron),
            startDate,
            endDate
        );
        return Array.from(cronDates).map((date) => ({
            amount: recurrence.amount,
            categoryId: recurrence.categoryId,
            date: date.toISOString(),
            note: recurrence.note,
            uuid: uuidv5(date.toISOString(), recurrence.uuid),
            recurrence: {
                uuid: recurrence.uuid,
                startDate: recurrence.startDate,
                endDate: recurrence.endDate,
                cron: recurrence.cron,
            },
        }));
    });
}

// Main hook to retrieve and summarize financial data
export function useFinancialSummary(startDate: Date, endDate: Date) {
    const { result: transactionsResult = [] } = getFilteredTransactions(
        (collection) =>
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

    const { result: recurrences = [] } = getRecurrencesForPeriod(
        startDate,
        endDate
    );

    const recurringTransactions = useMemo(
        () => generateRecurringTransactions(recurrences, startDate, endDate),
        [recurrences, startDate, endDate]
    );

    const allTransactions = useMemo(() => {
        return [...transactionsResult, ...recurringTransactions].sort(
            (a, b) => Date.parse(a.date) - Date.parse(b.date)
        );
    }, [transactionsResult, recurringTransactions]);

    const { result: categories = [] } = useCategories();
    const categoryMap = useMemo(
        () => new Map(categories.map((category) => [category.uuid, category])),
        [categories]
    );

    const financialSummary = useMemo(() => {
        return calculateFinancialSummary(allTransactions, categoryMap);
    }, [allTransactions, categoryMap]);

    return {
        ...financialSummary,
        transactions: allTransactions,
        categories: categoryMap,
    };
}
