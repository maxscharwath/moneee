import { memo, useCallback, useMemo } from 'react';
import { TransactionItem } from '@/components/transaction-item';
import { Separator } from '@/components/ui/separator';
import { Currency } from '@/components/currency';
import { type Transaction } from '@/stores/schemas/transaction';
import { type Category } from '@/stores/schemas/category';
import { useLocale } from '@/i18n';
import * as LongPressDialog from '@/components/ui/longpress-dialog';
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';
import { useLayout } from '@/routes/Layout';

type TransactionGroupProps = {
    date: string;
    transactions: Transaction[];
    categories: Category[];
    onTransactionLongPress?: (transaction: Transaction) => void;
};

export const TransactionGroup = memo(
    ({
        date,
        transactions,
        categories,
        onTransactionLongPress,
    }: TransactionGroupProps) => {
        const { formatter, t } = useLocale();
        const totalTransactions = useCallback(
            (transactions: Transaction[]) =>
                transactions.reduce((acc, transaction) => {
                    const transactionType = categories.find(
                        (category) => category.uuid === transaction.categoryId
                    )?.type;
                    return (
                        acc +
                        (transactionType === 'expense'
                            ? -transaction.amount
                            : transaction.amount)
                    );
                }, 0),
            [categories]
        );

        const transactionsWithCategory = useMemo(
            () =>
                transactions.map((transaction) => ({
                    transaction,
                    category: categories.find(
                        (category) => category.uuid === transaction.categoryId
                    )!,
                })),
            [transactions, categories]
        );

        const { openTransactionModal } = useLayout();

        return (
            <>
                <h2 className="mb-2 flex items-center justify-between space-x-2 text-sm font-bold text-muted-foreground">
                    <span>
                        {formatter.date(new Date(date), {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                        })}
                    </span>
                    <Currency
                        amount={totalTransactions(transactions)}
                        signDisplay="always"
                    />
                </h2>
                <Separator className="my-2" />
                <ul className="gap-1">
                    {transactionsWithCategory.map(
                        ({ transaction, category }) => (
                            <li key={transaction.uuid}>
                                <LongPressDialog.Root>
                                    <LongPressDialog.Trigger asChild>
                                        <TransactionItem
                                            transaction={transaction}
                                            category={category}
                                            onClick={() => {
                                                openTransactionModal(
                                                    transaction
                                                );
                                            }}
                                        />
                                    </LongPressDialog.Trigger>
                                    <LongPressDialog.Content>
                                        <Button
                                            className="gap-2"
                                            onClick={() => {
                                                onTransactionLongPress?.(
                                                    transaction
                                                );
                                            }}
                                        >
                                            {t('transaction.remove')}
                                            <Trash2Icon className="ml-auto" />
                                        </Button>
                                    </LongPressDialog.Content>
                                </LongPressDialog.Root>
                            </li>
                        )
                    )}
                </ul>
            </>
        );
    }
);

TransactionGroup.displayName = 'TransactionGroup';
