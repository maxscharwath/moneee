import { Currency } from '@/components/currency'
import { TransactionItem } from '@/components/transaction-item'
import { Button } from '@/components/ui/button'
import * as LongPressDialog from '@/components/ui/longpress-dialog'
import { Separator } from '@/components/ui/separator'
import { useLocale } from '@/i18n'
import { useLayout } from '@/routes/Layout'
import type { Category } from '@/stores/schemas/category'
import type { Transaction } from '@/stores/schemas/transaction'
import { Trash2Icon } from 'lucide-react'
import { memo, useCallback, useMemo } from 'react'

type TransactionGroupProps = {
	date: string;
	transactions: Transaction[];
	categories: Map<string, Category>;
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
					const transactionType = categories.get(transaction.categoryId)?.type;
					return (
						acc +
						(transactionType === "expense"
							? -transaction.amount
							: transaction.amount)
					);
				}, 0),
			[categories],
		);

		const transactionsWithCategory = useMemo(() => {
			const result = [];
			for (const transaction of transactions) {
				const category = categories.get(transaction.categoryId);
				if (category) {
					result.push({ transaction, category });
				}
			}
			return result;
		}, [transactions, categories]);

		const { openTransactionModal } = useLayout();

		return (
			<>
				<h2 className="mb-2 flex items-center justify-between space-x-2 text-sm font-bold text-muted-foreground">
					<span>
						{formatter.date(new Date(date), {
							weekday: "short",
							day: "numeric",
							month: "short",
						})}
					</span>
					<Currency
						amount={totalTransactions(transactions)}
						signDisplay="always"
					/>
				</h2>
				<Separator className="my-2" />
				<ul className="gap-1">
					{transactionsWithCategory.map(({ transaction, category }) => (
						<li key={transaction.uuid}>
							<LongPressDialog.Root>
								<LongPressDialog.Trigger asChild>
									<TransactionItem
										transaction={transaction}
										category={category}
										onClick={() => {
											openTransactionModal(transaction);
										}}
									/>
								</LongPressDialog.Trigger>
								<LongPressDialog.Content>
									<Button
										className="gap-2"
										onClick={() => {
											onTransactionLongPress?.(transaction);
										}}
									>
										{t("transaction.remove")}
										<Trash2Icon className="ml-auto" />
									</Button>
								</LongPressDialog.Content>
							</LongPressDialog.Root>
						</li>
					))}
				</ul>
			</>
		);
	},
);

TransactionGroup.displayName = "TransactionGroup";
