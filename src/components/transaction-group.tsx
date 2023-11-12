import {memo, useCallback, useMemo} from 'react';
import {TransactionItem} from '@/components/transaction-item.tsx';
import {Separator} from '@/components/ui/separator.tsx';
import {Currency} from '@/components/currency.tsx';
import {type Transaction} from '@/stores/schemas/transaction.ts';
import {type Category} from '@/stores/schemas/category.ts';
import {useLocale} from '@/i18n.ts';

type TransactionGroupProps = {
	date: string;
	transactions: Transaction[];
	categories: Category[];
	onTransactionLongPress?: (transaction: Transaction) => void;
};

export const TransactionGroup = memo(({
	date,
	transactions,
	categories,
	onTransactionLongPress,
}: TransactionGroupProps) => {
	const {formater} = useLocale();
	const totalTransactions = useCallback(
		(transactions: Transaction[]) => transactions.reduce(
			(acc, transaction) => {
				const transactionType = categories.find(
					category => category.uuid === transaction.category_id,
				)?.type;
				return (
					acc
          + (transactionType === 'expense' ? -transaction.amount : transaction.amount)
				);
			},
			0,
		),
		[categories],
	);

	const transactionsWithCategory = useMemo(() => transactions.map(transaction => ({
		transaction,
		category: categories.find(category => category.uuid === transaction.category_id)!,
	})), [transactions, categories]);

	return (
		<>
			<h2
				className='mb-2 flex items-center justify-between space-x-2 text-sm font-bold text-muted-foreground'>
				<span>
					{formater.date(new Date(date), {
						weekday: 'short',
						day: 'numeric',
						month: 'short',
					})}
				</span>
				<Currency amount={totalTransactions(transactions)} signDisplay='always'/>
			</h2>
			<Separator className='my-2'/>
			<ul className='space-y-2'>
				{transactionsWithCategory.map(({
					transaction,
					category,
				}) => (
					<li key={transaction.uuid}>
						<TransactionItem transaction={transaction} category={category} onLongPress={onTransactionLongPress}/>
					</li>
				))}
			</ul>
		</>
	);
});

TransactionGroup.displayName = 'TransactionGroup';
