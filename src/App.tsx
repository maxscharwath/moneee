import {Avatar, AvatarFallback} from '@/components/ui/avatar.tsx';
import {Separator} from '@/components/ui/separator.tsx';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import {ArrowDownRight, ArrowUpRight, PlusIcon, RotateCw} from 'lucide-react';
import {Bar, BarChart, ResponsiveContainer, XAxis, YAxis} from 'recharts';
import {useCallback, useMemo, useState} from 'react';
import {cn} from '@/lib/utils.ts';
import {FinanceButton} from '@/components/FinanceButton.tsx';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select.tsx';
import {Button} from '@/components/ui/button.tsx';
import {useTransactionService} from '@/stores/transactionService.tsx';
import {useCategoryService} from '@/stores/categoryService.tsx';
import {type Transaction} from '@/stores/models.ts';

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

	const totalTransactions = useCallback((transactions: Transaction[]) => transactions.reduce(
		(acc, transaction) => {
			const transactionType = categories.find(category => category.id === transaction.categoryId)?.type;
			return acc + (transactionType === 'expense' ? -transaction.amount : transaction.amount);
		},
		0,
	), [categories]);

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

	const groupedTransactions = useMemo(() => {
		const groupedTransactions = new Map<string, Transaction[]>();
		transactions.forEach(transaction => {
			const key = new Date(transaction.date).toDateString();
			const transactionsForThisMonth = groupedTransactions.get(key) ?? [];
			transactionsForThisMonth.push(transaction);
			groupedTransactions.set(key, transactionsForThisMonth);
		});

		return Array.from(groupedTransactions.entries());
	}, [transactions]);

	return (
		<>
			<nav className='sticky top-0 z-10 flex items-center justify-between p-4 bg-background shadow-md portrait:standalone:pt-14'>
				<h1 className='font-bold text-2xl'>Insights</h1>
				<Select defaultValue='monthly'>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Select period'/>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='weekly'>Weekly</SelectItem>
						<SelectItem value='monthly'>Monthly</SelectItem>
						<SelectItem value='yearly'>Yearly</SelectItem>
					</SelectContent>
				</Select>
			</nav>
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
				<ResponsiveContainer width='100%' height={200}>
					<BarChart data={chartData}>
						<XAxis
							dataKey='name'
							stroke='#888888'
							fontSize={12}
							tickLine={false}
							axisLine={false}
							tickCount={30}
							minTickGap={20}
						/>
						<YAxis
							stroke='#888888'
							fontSize={12}
							tickLine={false}
							axisLine={false}
							tickFormatter={(value: number) => (value >= 1000 ? `${value / 1000}K` : value).toLocaleString('fr-CH')}
							tickCount={3}
						/>
						<Bar dataKey='total' fill='#adfa1d' radius={[4, 4, 0, 0]}/>
					</BarChart>
				</ResponsiveContainer>
				<div className='flex items-center justify-between'>
					<span className='font-bold text-2xl'>{period.toLocaleDateString('fr-CH', {
						dateStyle: 'long',
					})}</span>
					<span className='font-bold text-2xl'>
						{(totalIncome - totalExpenses).toLocaleString('fr-CH', {
							style: 'currency',
							currency: 'CHF',
						})}
					</span>
				</div>
				<Separator className='my-4'/>
				<ul className='space-y-8'>
					{groupedTransactions.map(([key, transactions]) => (
						<li key={key}>
							<h2 className='font-bold text-lg flex items-center justify-between space-x-2 mb-2'>
								<span>{new Date(key).toLocaleDateString('fr-CH', {
									dateStyle: 'long',
								})}</span>
								<span>{totalTransactions(transactions).toLocaleString('fr-CH', {
									style: 'currency',
									currency: 'CHF',
									signDisplay: 'always',
								})}</span>
							</h2>
							<Separator className='my-2'/>
							<ul className='space-y-2'>
								{transactions.map(transaction => {
									const category = categories.find(
										category => category.id === transaction.categoryId,
									);
									return (
										<li
											key={transaction.id}
											className='flex items-center space-x-2'
										>
											<Avatar>
												<AvatarFallback style={{backgroundColor: category?.color}} className='text-xl'>
													{category?.icon}
												</AvatarFallback>
												{transaction.recurrence !== 'once' && (
													<div
														className='absolute bottom-0 right-0 text-xs rounded-xl p-1 transform translate-x-1/4 translate-y-1/4 backdrop-blur-sm border bg-background/50'>
														<RotateCw size={12}/>
													</div>
												)}
											</Avatar>
											<div className='flex flex-col'>
												<h3 className='font-bold'>{transaction.name}</h3>
												<time className='text-sm text-zinc-400'>
													{new Date(transaction.date).toLocaleString('fr-CH', {
														timeStyle: 'short',
														dateStyle: 'medium',
													})}
												</time>
											</div>
											<span
												className={cn('font-bold flex-grow text-right', category?.type === 'income' && 'text-green-500')}
											>
												{(transaction.amount * (category?.type === 'expense' ? -1 : 1)).toLocaleString('fr-CH', {
													style: 'currency',
													currency: 'CHF',
													signDisplay: 'always',
												})}
											</span>
										</li>
									);
								})}
							</ul>
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
