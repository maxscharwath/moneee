import type { Transaction } from '@/stores/schemas/transaction';
import type { Category } from '@/stores/schemas/category';
import { initializeDb } from '@/stores/db';
import { generateRecurringTransactions } from '@/hooks/useRecurrence';

export const exportToCsv = async () => {
    try {
        const db = await initializeDb();

        const transactions = await db.transactions
            .find({ sort: [{ date: 'desc' }] })
            .exec();

        const recurrings = await db.recurrences.find().exec();

        const categories = await db.categories.find().exec();
        const categoryMap = new Map(
            categories.map((category) => [category.uuid, category])
        );

        const endOfYear = new Date(new Date().getFullYear(), 11, 31);
        const recurringTransactions = generateRecurringTransactions(
            recurrings,
            new Date(0),
            endOfYear
        );

        const allTransactions = [
            ...transactions,
            ...recurringTransactions,
        ].sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

        const content = formatCSV(allTransactions, categoryMap);
        const file = new File([content], 'transactions.csv', {
            type: 'text/csv',
        });

        if (navigator.share) {
            await navigator.share({
                title: 'Transactions',
                text: 'Transactions CSV',
                files: [file],
            });
        } else {
            download(file);
        }

        console.log('Export successful!');
    } catch (error) {
        console.error('Export failed:', error);
    }
};

const formatCSV = (
    transactions: Transaction[],
    categoryMap: Map<string, Category>
) => {
    const escapeField = (field?: string | number) =>
        field != null ? `"${String(field).replace(/"/g, '""')}"` : '';

    const headers = ['Amount', 'Date', 'Note', 'Category Name', 'Category Type']
        .map(escapeField)
        .join(',');

    const rows = transactions.map((transaction) => {
        const category = categoryMap.get(transaction.categoryId);
        return [
            escapeField(transaction.amount),
            escapeField(new Date(transaction.date).toLocaleString()),
            escapeField(transaction.note),
            escapeField(category?.name ?? 'Uncategorized'),
            escapeField(category?.type ?? 'Unknown'),
        ].join(',');
    });

    return [headers, ...rows].join('\n');
};

const download = (file: File) => {
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
};
