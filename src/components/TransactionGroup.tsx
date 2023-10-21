import {TransactionItem} from '@/components/TransactionItem.tsx';
import {Separator} from '@/components/ui/separator.tsx';
import {memo, useCallback, useMemo} from 'react';
import {type Category, type Transaction} from '@/stores/models.ts';
import Currency from '@/components/Currency.tsx';

type TransactionGroupProps = {
	date: string;
	transactions: Transaction[];
	categories: Category[];
};

export const TransactionGroup = memo(({date, transactions, categories}: TransactionGroupProps) => {
	const totalTransactions = useCallback(
		(transactions: Transaction[]) =>
			transactions.reduce(
				(acc, transaction) => {
					const transactionType = categories.find(
						category => category.id === transaction.categoryId,
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
		category: categories.find(category => category.id === transaction.categoryId)!,
	})), [transactions, categories]);

	return (
		<>
			<h2 className='font-bold text-lg flex items-center justify-between space-x-2 mb-2'>
				<span>
					{new Date(date).toLocaleDateString('fr-CH', {
						dateStyle: 'long',
					})}
				</span>
				<Currency amount={totalTransactions(transactions)} signDisplay='always'/>
			</h2>
			<Separator className='my-2'/>
			<ul className='space-y-2'>
				{transactionsWithCategory.map(({transaction, category}) => (
					<li key={transaction.id}>
						<TransactionItem transaction={transaction} category={category}/>
					</li>
				))}
			</ul>
		</>
	);
});

TransactionGroup.displayName = 'TransactionGroup';
