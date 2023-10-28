import * as ToggleGroup from '@radix-ui/react-toggle-group';
import {ArrowDownRight, ArrowUpRight, Coins, PlusIcon} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import {useMemo, useState} from 'react';
import {FinanceButton} from '@/components/finance-button.tsx';
import {Button} from '@/components/ui/button.tsx';
import {useTransactionService} from '@/stores/transactionService.tsx';
import {useCategoryService} from '@/stores/categoryService.tsx';
import {Header} from '@/components/header.tsx';
import {Chart} from '@/components/chart.tsx';
import {TransactionGroup} from '@/components/transaction-group.tsx';
import {cn, groupBy} from '@/lib/utils.ts';
import Currency from '@/components/currency.tsx';
import TransactionModal from '@/components/transaction-modal.tsx';
import {usePeriod, usePeriodTitle} from '@/hooks/usePeriod.ts';
import {type Category, type Transaction} from '@/stores/models.ts';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert.tsx';
import {motion, AnimatePresence} from 'framer-motion';

type Filter = 'income' | 'expense' | 'all';

function App() {
	const {
		getTransactionsForPeriod,
		addTransaction,
	} = useTransactionService();
	const {
		categories,
		getCategoryById,
	} = useCategoryService();

	const [filter, setFilter] = useState<Filter>('all');
	const [categoryFilter, setCategoryFilter] = useState('');

	const {
		currentPeriod,
		periodType,
		setPeriodType,
		nextPeriod,
		previousPeriod,
		getPeriodDates: [startDate, endDate],
	} = usePeriod();

	const transactions = getTransactionsForPeriod(startDate, endDate);

	const filteredTransactions = useMemo(() =>
		transactions
			.filter(transaction => filter === 'all' || categories.find(category => category.id === transaction.categoryId)?.type === filter)
			.filter(transaction => categoryFilter === '' || transaction.categoryId === categoryFilter),
	[transactions, categoryFilter]);

	const {
		totalIncome,
		totalExpenses,
	} = useMemo(() => transactions.reduce(
		(acc, transaction) => {
			const category = getCategoryById(transaction.categoryId);
			const amount = category?.type === 'expense' ? -transaction.amount : transaction.amount;
			return {
				totalIncome: acc.totalIncome + (amount > 0 ? amount : 0),
				totalExpenses: acc.totalExpenses + (amount < 0 ? -amount : 0),
			};
		},
		{
			totalIncome: 0,
			totalExpenses: 0,
		},
	), [transactions, getCategoryById]);

	const getDaysInPeriod = (periodType: string, date: Date): number => {
		switch (periodType) {
			case 'weekly':
				return 7;
			case 'yearly':
				return 365 + (date.getFullYear() % 4 === 0 ? 1 : 0); // Accounting for leap year
			case 'monthly':
			default:
				return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); // Getting the last day of the month
		}
	};

	const filterTransactionAmount = (transaction: Transaction): number => {
		const transactionType = categories.find(category => category.id === transaction.categoryId)?.type;
		return (filter === 'all' || filter === transactionType) ? transaction.amount : 0;
	};

	const generateDateForDayIndex = (dayIndex: number, periodType: string, currentPeriod: Date): Date => {
		switch (periodType) {
			case 'weekly': {
				const startOfWeek = new Date(currentPeriod);
				startOfWeek.setDate(currentPeriod.getDate() - currentPeriod.getDay());
				return new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + dayIndex);
			}

			case 'yearly':
				return new Date(currentPeriod.getFullYear(), dayIndex, 1); // Returns first day of each month for the current year
			case 'monthly':
			default:
				return new Date(currentPeriod.getFullYear(), currentPeriod.getMonth(), dayIndex + 1);
		}
	};

	const chartData = useMemo(() => {
		if (periodType === 'yearly') {
			return Array.from({length: 12}, (_, monthIndex) => { // 12 months in a year
				const transactionsInThisMonth = filteredTransactions.filter(t => {
					const transactionDate = new Date(t.date);
					return transactionDate.getFullYear() === currentPeriod.getFullYear() && transactionDate.getMonth() === monthIndex;
				});
				const total = transactionsInThisMonth.reduce((acc, transaction) => acc + filterTransactionAmount(transaction), 0);

				return {
					name: new Date(currentPeriod.getFullYear(), monthIndex).toLocaleDateString('fr-CH', {month: 'short'}), // Jan, Feb, ...
					total,
				};
			});
		}

		const daysInPeriod = getDaysInPeriod(periodType, currentPeriod);

		return Array.from({length: daysInPeriod}, (_, dayIndex) => {
			const date = generateDateForDayIndex(dayIndex, periodType, currentPeriod);
			const transactionsOnThisDay = filteredTransactions.filter(t => new Date(t.date).getDate() === date.getDate());
			const total = transactionsOnThisDay.reduce((acc, transaction) => acc + filterTransactionAmount(transaction), 0);

			return {
				name: date.toLocaleDateString('fr-CH', {day: '2-digit'}),
				total,
			};
		});
	}, [filteredTransactions, categories, filter, periodType, currentPeriod]);

	const handleTransaction = (amount: number, date: Date, categoryId: string) => {
		const category = getCategoryById(categoryId);
		if (!category) {
			return;
		}

		addTransaction({
			name: category.name,
			amount,
			categoryId,
			date: date.toISOString(),
		});

		setShowModal(false);
	};

	const categorySpendDetails = useMemo(() => {
		const categorySpend: Record<string, {category: Category; total: number}> = {};

		transactions.forEach(transaction => {
			const category = getCategoryById(transaction.categoryId);
			if (filter === category?.type) {
				categorySpend[category.id] = {
					total: (categorySpend[category.id]?.total || 0) + transaction.amount,
					category,
				};
			}
		});

		return Object.values(categorySpend);
	}, [transactions, getCategoryById]);

	const groupedTransactions = useMemo(() => Object.entries(groupBy(filteredTransactions, transaction => new Date(transaction.date).toDateString())), [transactions]);
	const [showModal, setShowModal] = useState(false);
	return (
		<div className='flex h-screen flex-col'>
			<Header
				title='Insights'
				defaultValue={periodType}
				onNextPeriod={nextPeriod}
				onPreviousPeriod={previousPeriod}
				onPeriodChange={setPeriodType}
			/>
			<div className='flex-1 space-y-4 p-4'>
				<div className='flex items-center justify-between'>
					<span className='text-2xl font-bold'>
						{usePeriodTitle(periodType, currentPeriod)}
					</span>
					<Currency amount={(totalIncome - totalExpenses)} className='text-2xl font-bold'/>
				</div>
				<ToggleGroup.Root
					type='single'
					className='flex space-x-2'
					value={filter}
					onValueChange={(f: Filter) => {
						setFilter(f || 'all');
						setCategoryFilter('');
					}}
				>
					<ToggleGroup.Item value='income' asChild>
						<FinanceButton
							colorClass='bg-green-500/30 text-green-500'
							icon={<ArrowUpRight size={24}/>}
							label='Income'
							amount={totalIncome}
						/>
					</ToggleGroup.Item>
					<ToggleGroup.Item value='expense' asChild>
						<FinanceButton
							colorClass='bg-red-500/30 text-red-500'
							icon={<ArrowDownRight size={24}/>}
							label='Expenses'
							amount={totalExpenses}
						/>
					</ToggleGroup.Item>
				</ToggleGroup.Root>
				<AnimatePresence>
					{filter !== 'all' && filteredTransactions.length > 0 && (
						<motion.div
							initial={{opacity: 0, height: 0}}
							animate={{opacity: 1, height: 'auto'}}
							exit={{opacity: 0, height: 0}}
						>
							<Chart data={chartData}/>
							<CategoryChart
								data={categorySpendDetails}
								selected={categoryFilter}
								onSelect={setCategoryFilter}
							/>
						</motion.div>
					)}
				</AnimatePresence>
				{groupedTransactions.length > 0 ? (
					<ul className='space-y-8'>
						{groupedTransactions.map(([key, transactions]) => (
							<li key={key}>
								<TransactionGroup date={key} transactions={transactions} categories={categories}/>
							</li>
						))}
					</ul>
				) : (
					<Alert align='center'>
						<Coins className='h-4 w-4' />
						<AlertTitle>No transactions</AlertTitle>
						<AlertDescription>
							You don't have any transactions for this period.
						</AlertDescription>
					</Alert>
				)}
			</div>
			<nav
				className='sticky bottom-0 z-50 flex w-full items-center justify-center bg-background p-4 shadow-md portrait:standalone:pb-14'>
				<Button onClick={() => setShowModal(true)}>
					<PlusIcon size={24}/>
				</Button>
			</nav>
			<Dialog.Root open={showModal} onOpenChange={setShowModal}>
				<Dialog.Content className='fixed inset-0 z-50 bg-background/90 backdrop-blur-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-[48%] data-[state=open]:slide-in-from-bottom-[48%]'>
					<TransactionModal onTransaction={handleTransaction}/>
				</Dialog.Content>
			</Dialog.Root>
		</div>
	);
}

export default App;

type CategoryChartProps = {
	data: Array<{category: Category; total: number}>;
	selected?: string;
	onSelect?: (category: string) => void;
};

export const CategoryChart = ({data, selected, onSelect}: CategoryChartProps) => {
	const totalValue = data.reduce((acc, item) => acc + item.total, 0);

	return (
		<ToggleGroup.Root
			type='single'
			value={selected}
			onValueChange={onSelect}
			className='space-y-2'
		>
			<div className='flex h-6 w-full gap-1'>
				{data.map(({category, total}) => (
					<ToggleGroup.Item
						key={category.id}
						value={category.id}
						style={{
							width: `${(total / totalValue) * 100}%`,
							backgroundColor: category.color,
						}}
						className={cn(
							'flex items-center justify-center rounded-md transition-all duration-200',
							'data-[state=on]:ring-2 data-[state=on]:ring-primary',
							selected && 'data-[state=off]:opacity-50',
						)}
					/>
				))}
			</div>
			<div className='no-scrollbar flex gap-1 overflow-x-auto p-2'>
				{data.map(({category, total}) => (
					<ToggleGroup.Item key={category.id} value={category.id} asChild>
						<Button
							variant='ghost'
							size='sm'
							className={cn(
								'flex items-center space-x-2',
								'ring-primary/50 data-[state=on]:ring data-[state=on]:bg-secondary',
							)}
						>
							<div style={{backgroundColor: category.color}} className='h-4 w-4 rounded-md'></div>
							<span className='font-semibold'>{category.name}</span>
							<span className='text-sm text-zinc-400'>
								{Math.round((total / totalValue) * 100)}%
							</span>
						</Button>
					</ToggleGroup.Item>
				))}
			</div>
		</ToggleGroup.Root>
	);
};

