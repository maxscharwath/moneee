import {Separator} from '@/components/ui/separator.tsx';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import {ArrowDownRight, ArrowUpRight, PlusIcon} from 'lucide-react';
import {useMemo, useState} from 'react';
import {FinanceButton} from '@/components/FinanceButton.tsx';
import {Button} from '@/components/ui/button.tsx';
import {useTransactionService} from '@/stores/transactionService.tsx';
import {useCategoryService} from '@/stores/categoryService.tsx';
import {Header} from '@/components/Header.tsx';
import {Chart} from '@/components/Chart.tsx';
import {TransactionGroup} from '@/components/TransactionGroup.tsx';
import {groupBy} from '@/lib/utils.ts';
import Currency from '@/components/Currency.tsx';

function App() {
	const {getTransactionsForPeriod, addTransaction} = useTransactionService();
	const {categories, getCategoryById} = useCategoryService();

	const period = new Date(2023, 9);
	const transactions = getTransactionsForPeriod(period, new Date(2023, 10));

	const [filter, setFilter] = useState<'income' | 'expense' | 'all' | string>('all');

	const {totalIncome, totalExpenses} = useMemo(() => transactions.reduce(
		(acc, transaction) => {
			const category = getCategoryById(transaction.categoryId);
			const amount = category?.type === 'expense' ? -transaction.amount : transaction.amount;
			return {
				totalIncome: acc.totalIncome + (amount > 0 ? amount : 0),
				totalExpenses: acc.totalExpenses + (amount < 0 ? -amount : 0),
			};
		},
		{totalIncome: 0, totalExpenses: 0},
	), [transactions, getCategoryById]);

	const chartData = useMemo(() => Array.from({length: 31}, (_, dayIndex) => {
		const date = new Date(2023, 9, dayIndex + 1);
		const transactionsOnThisDay = transactions.filter(
			transaction => new Date(transaction.date).getDate() === date.getDate(),
		);

		const total = transactionsOnThisDay.reduce(
			(acc, transaction) => {
				const transactionType = categories.find(category => category.id === transaction.categoryId)?.type;
				if (filter === 'all' || filter === transactionType) {
					return acc + transaction.amount;
				}

				return acc;
			},
			0,
		);

		return {
			name: date.toLocaleDateString('fr-CH', {day: '2-digit'}),
			total,
		};
	}), [transactions, categories, filter]);

	const handleTransaction = () => {
		const category = categories[Math.floor(Math.random() * categories.length)];
		addTransaction({
			name: category.name,
			amount: Math.random() * 1000,
			categoryId: category.id,
			date: new Date(period.getFullYear(), period.getMonth(), Math.floor(Math.random() * 30) + 1).toISOString(),
			recurrence: 'once',
		});
	};

	const groupedTransactions = useMemo(() => Object.entries(groupBy(transactions, transaction => new Date(transaction.date).toDateString())), [transactions]);

	return (
		<>
			<Header title='Insights' defaultValue='monthly' />
			<div className='p-4 space-y-4'>
				<ToggleGroup.Root
					type='single'
					className='flex space-x-2'
					value={filter}
					onValueChange={f => {
						setFilter(f || 'all');
					}}
				>
					<ToggleGroup.Item value='income' asChild>
						<FinanceButton colorClass='bg-green-500/30 text-green-500' icon={<ArrowUpRight size={24}/>}
							label='Income' amount={totalIncome}/>
					</ToggleGroup.Item>
					<ToggleGroup.Item value='expense' asChild>
						<FinanceButton colorClass='bg-red-500/30 text-red-500' icon={<ArrowDownRight size={24}/>}
							label='Expenses' amount={totalExpenses}/>
					</ToggleGroup.Item>
				</ToggleGroup.Root>
				<Chart data={chartData} />
				<div className='flex items-center justify-between'>
					<span className='font-bold text-2xl'>{period.toLocaleDateString('fr-CH', {
						dateStyle: 'long',
					})}</span>
					<Currency amount={(totalIncome - totalExpenses)} className='font-bold text-2xl'/>
				</div>
				<Separator className='my-4'/>
				<ul className='space-y-8'>
					{groupedTransactions.map(([key, transactions]) => (
						<li key={key}>
							<TransactionGroup date={key} transactions={transactions} categories={categories}/>
						</li>
					))}
				</ul>
			</div>
			<nav className='sticky bottom-0 z-10 flex items-center p-4 bg-background shadow-md justify-center portrait:standalone:pb-14'>
				<Button onClick={handleTransaction}>
					<PlusIcon size={24}/>
				</Button>
			</nav>
		</>
	);
}

export default App;
