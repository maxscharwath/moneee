import * as ToggleGroup from '@radix-ui/react-toggle-group';
import {ArrowDownRight, ArrowUpRight, Coins, PlusIcon} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import {useMemo, useState} from 'react';
import {FinanceButton} from '@/components/finance-button.tsx';
import {Button} from '@/components/ui/button.tsx';
import {Header} from '@/components/header.tsx';
import {Chart} from '@/components/chart.tsx';
import {TransactionGroup} from '@/components/transaction-group.tsx';
import {groupBy} from '@/lib/utils.ts';
import Currency from '@/components/currency.tsx';
import TransactionModal from '@/components/transaction-modal.tsx';
import {usePeriod, usePeriodTitle} from '@/hooks/usePeriod.ts';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert.tsx';
import {motion, AnimatePresence} from 'framer-motion';
import {CategoryChart} from '@/components/category-chart.tsx';
import {useTranslation} from 'react-i18next';
import {
	addTransaction, type Category, getFilteredTransactions,
	type Transaction,
	useCategories,
} from '@/stores/db.ts';

type Filter = 'income' | 'expense' | 'all';

function App() {
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

	const {result: transactions} = getFilteredTransactions(collection => collection.find({
		selector: {
			date: {
				$gte: startDate.toISOString(),
				$lte: endDate.toISOString(),
			},
		},
		sort: [{date: 'desc'}],
	}));

	const {result: categories} = useCategories();

	const filteredTransactions = useMemo(() =>
		transactions
			.filter(transaction => filter === 'all' || categories.find(category => category.uuid === transaction.category_id)?.type === filter)
			.filter(transaction => categoryFilter === '' || transaction.category_id === categoryFilter),
	[transactions, categories, filter, categoryFilter]);

	const {
		totalIncome,
		totalExpenses,
	} = useMemo(() => transactions.reduce(
		(acc, transaction) => {
			const category = categories.find(category => category.uuid === transaction.category_id);
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
	), [transactions, categories]);

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
		const transactionType = categories.find(category => category.uuid === transaction.category_id)?.type;
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
			return Array.from({length: 12}, (_, monthIndex) => {
				const transactionsInThisMonth = filteredTransactions.filter(t => {
					const transactionDate = new Date(t.date);
					return transactionDate.getFullYear() === currentPeriod.getFullYear() && transactionDate.getMonth() === monthIndex;
				});
				const total = transactionsInThisMonth.reduce((acc, transaction) => acc + filterTransactionAmount(transaction), 0);

				return {
					name: new Date(currentPeriod.getFullYear(), monthIndex).toLocaleDateString('fr-CH', {month: 'short'}),
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

	const handleTransaction = (amount: number, date: Date, categoryId: string, note: string) => {
		void addTransaction({
			note,
			amount,
			category_id: categoryId,
			date: date.toISOString(),
		});

		setShowModal(false);
	};

	const categorySpendDetails = useMemo(() => {
		const categorySpend: Record<string, {category: Category; total: number}> = {};

		transactions.forEach(transaction => {
			const category = categories.find(category => category.uuid === transaction.category_id);
			if (filter === category?.type) {
				categorySpend[category.uuid] = {
					total: (categorySpend[category.uuid]?.total || 0) + transaction.amount,
					category,
				};
			}
		});

		return Object.values(categorySpend);
	}, [transactions, categories, filter]);
	const {t} = useTranslation();

	const groupedTransactions = useMemo(() => Object.entries(groupBy(filteredTransactions, transaction => new Date(transaction.date).toDateString())), [transactions, categories, filter, categoryFilter]);
	const [showModal, setShowModal] = useState(false);

	return (
		<div className='flex h-[100dvh] flex-col'>
			<Header
				title={t('insights.title')}
				defaultValue={periodType}
				onNextPeriod={nextPeriod}
				onPreviousPeriod={previousPeriod}
				onPeriodChange={setPeriodType}
			/>
			<div className='flex-1 space-y-4 overflow-y-auto p-4'>
				<motion.div
					className='space-y-4'
					drag='x'
					dragConstraints={{left: 0, right: 0}}
					dragElastic={0.1}
					onDragEnd={(_event, {offset, velocity}) => {
						const swipe = Math.abs(offset.x) * velocity.x;
						const swipeThreshold = 10000;
						if (swipe < -swipeThreshold) {
							nextPeriod();
						} else if (swipe > swipeThreshold) {
							previousPeriod();
						}
					}}
				>
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
								label={t('transaction.income')}
								amount={totalIncome}
							/>
						</ToggleGroup.Item>
						<ToggleGroup.Item value='expense' asChild>
							<FinanceButton
								colorClass='bg-red-500/30 text-red-500'
								icon={<ArrowDownRight size={24}/>}
								label={t('transaction.expense')}
								amount={totalExpenses}
							/>
						</ToggleGroup.Item>
					</ToggleGroup.Root>
				</motion.div>
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
						<AlertTitle>{t('transaction.noTransactions.title')}</AlertTitle>
						<AlertDescription>{t('transaction.noTransactions.description')}</AlertDescription>
					</Alert>
				)}
			</div>
			<nav
				className='flex w-full items-center justify-center bg-background p-4 shadow-md portrait:standalone:pb-14'>
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
