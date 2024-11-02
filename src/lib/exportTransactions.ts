import type { Transaction } from '@/stores/schemas/transaction';
import type { Category } from '@/stores/schemas/category';
import { initializeDb } from '@/stores/db';

export const exportToCsv = async () => {
    try {
        const db = await initializeDb();
        const transactions = await db.transactions
            .find({
                sort: [{ date: 'desc' }],
            })
            .exec();
        const categories = await db.categories.find().exec();
        const content = formatCSV(transactions, categories);

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

const formatCSV = (transactions: Transaction[], categories: Category[]) => {
    const escapeField = (field?: string) =>
        field ? `"${field.replace(/"/g, '""')}"` : '';

    const headers = ['Amount', 'Date', 'Note', 'Category Name', 'Category Type']
        .map(escapeField)
        .join(',');

    const rows = transactions.map((transaction) => {
        const category = categories.find(
            (cat) => cat.uuid === transaction.categoryId
        );
        return [
            transaction.amount,
            new Date(transaction.date).toLocaleString(),
            escapeField(transaction.note),
            escapeField(category?.name),
            escapeField(category?.type),
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
