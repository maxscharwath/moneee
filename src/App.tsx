import {Avatar, AvatarFallback} from '@/components/ui/avatar.tsx';
import {Separator} from '@/components/ui/separator.tsx';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import {ArrowDownRight, ArrowUpRight, RotateCw} from 'lucide-react';
import {Bar, BarChart, ResponsiveContainer, XAxis, YAxis} from 'recharts';
import {useMemo, useState} from 'react';
import {cn} from '@/lib/utils.ts';
import {FinanceButton} from '@/FinanceButton.tsx';

const initialCategories = [
	{type: 'income', name: 'Salary', icon: '💰', color: '#10B981', id: 1},
	{type: 'expense', name: 'Rent', icon: '🏠', color: '#F87171', id: 2},
	{type: 'expense', name: 'Groceries', icon: '🍎', color: '#bb2cb9', id: 3},
	{type: 'expense', name: 'Entertainment', icon: '🎉', color: '#FBBF24', id: 4},
	{type: 'expense', name: 'Travel', icon: '✈️', color: '#FBBF24', id: 5},
	{type: 'expense', name: 'Health', icon: '🏥', color: '#F87171', id: 6},
	{type: 'expense', name: 'Other', icon: '📦', color: '#F87171', id: 7},
	{type: 'expense', name: 'Transport', icon: '🚗', color: '#5A61F6', id: 8},
];

const initialTransactions = [
	{
		id: 1,
		name: 'Salary',
		amount: 5707,
		date: '2023-10-01',
		categoryId: 1,
		recurrence: 'monthly',
	},
	{
		id: 2,
		name: 'Rent',
		amount: 1200,
		date: '2023-10-05',
		categoryId: 2,
		recurrence: 'monthly',
	},
	{
		id: 3,
		name: 'Groceries',
		amount: 300,
		date: '2023-10-06',
		categoryId: 3,
	},
	{
		id: 4,
		name: 'Entertainment',
		amount: 200,
		date: '2023-10-10',
		categoryId: 4,
	},
	{
		id: 5,
		name: 'Travel',
		amount: 100,
		date: '2023-10-15',
		categoryId: 5,
	},
	{
		id: 6,
		name: 'Health',
		amount: 200,
		date: '2023-10-15',
		categoryId: 6,
		recurrence: 'monthly',
	},
	{
		id: 7,
		name: 'Other',
		amount: 200,
		date: '2023-10-17',
		categoryId: 7,
	},
	{
		id: 8,
		name: 'Transport',
		amount: 110,
		date: '2023-10-20',
		categoryId: 8,
		recurrence: 'weekly',
	},
];

function useCategories() {
	const [categories, setCategories] = useState(initialCategories);
	const getCategoryById = (id: number) => categories.find(category => category.id === id);
	return {categories, setCategories, getCategoryById};
}

function useTransactions() {
	const [transactions, setTransactions] = useState(initialTransactions);
	return {transactions, setTransactions};
}

function App() {
	const {categories, getCategoryById} = useCategories();
	const {transactions} = useTransactions();

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

	return (
		<div className='p-4 space-y-4'>
			<ToggleGroup.Root
				type='single'
				className='flex space-x-2'
				value={filter}
				onValueChange={f => {
					setFilter(f ? f : 'all');
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
				<span className='font-bold text-2xl'>October 2023</span>
				<span className='font-bold text-2xl'>
					{(totalIncome - totalExpenses).toLocaleString('fr-CH', {
						style: 'currency',
						currency: 'CHF',
					})}
				</span>
			</div>
			<Separator className='my-4'/>
			<ul className='space-y-2'>
				{transactions.map(transaction => {
					const category = categories.find(
						category => category.id === transaction.categoryId,
					);
					return (
						<li
							key={transaction.id}
							className='flex items-center space-x-2 rounded-md border p-2'
						>
							<Avatar>
								<AvatarFallback style={{backgroundColor: category?.color}} className='text-xl'>
									{category?.icon}
								</AvatarFallback>
								{transaction.recurrence && (
									<div
										className='absolute bottom-0 right-0 text-xs rounded-xl p-1 transform translate-x-1/4 translate-y-1/4 backdrop-blur-sm border bg-background/50'>
										<RotateCw size={12}/>
									</div>
								)}
							</Avatar>
							<div className='flex flex-col'>
								<h3 className='font-bold'>{transaction.name}</h3>
								<time className='text-sm text-zinc-400'>
									{transaction.date}
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
		</div>
	);
}

export default App;
