import {memo, useCallback, useMemo} from 'react';
import {TransactionItem} from '@/components/transaction-item.tsx';
import {Separator} from '@/components/ui/separator.tsx';
import Currency from '@/components/currency.tsx';
import {type Transaction} from '@/stores/schemas/transaction.ts';
import {type Category} from '@/stores/schemas/category.ts';

type TransactionGroupProps = {
	date: string;
	transactions: Transaction[];
	categories: Category[];
};

export const TransactionGroup = memo(({
	date,
	transactions,
	categories,
}: TransactionGroupProps) => {
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
					{new Date(date).toLocaleDateString('fr-CH', {
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
						<TransactionItem transaction={transaction} category={category}/>
					</li>
				))}
			</ul>
		</>
	);
});

TransactionGroup.displayName = 'TransactionGroup';
