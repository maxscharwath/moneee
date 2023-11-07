import * as ToggleGroup from '@radix-ui/react-toggle-group';
import {ArrowDownRight, ArrowUpRight, Coins} from 'lucide-react';
import {useMemo, useState} from 'react';
import {FinanceButton} from '@/components/finance-button.tsx';
import {Header, HeaderTitle} from '@/components/header.tsx';
import {Chart} from '@/components/chart.tsx';
import {TransactionGroup} from '@/components/transaction-group.tsx';
import {groupBy} from '@/lib/utils.ts';
import Currency from '@/components/currency.tsx';
import {usePeriod, usePeriodTitle} from '@/hooks/usePeriod.ts';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert.tsx';
import {AnimatePresence, motion} from 'framer-motion';
import {CategoryChart} from '@/components/category-chart.tsx';
import {PeriodNavigation} from '@/components/PeriodNavigation.tsx';
import {
	getFilteredTransactions,
	useCategories,
} from '@/stores/db.ts';
import {type Transaction} from '@/stores/schemas/transaction.ts';
import {type Category} from '@/stores/schemas/category.ts';
import {useLocale} from '@/i18n.ts';
import {Container} from '@/components/Container.tsx';

type Filter = 'income' | 'expense' | 'all';

export function Component() {
	const {t, formater} = useLocale();
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
					name: formater.date(new Date(currentPeriod.getFullYear(), monthIndex), {month: 'short'}),
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
				name: formater.date(date, {day: '2-digit'}),
				total,
			};
		});
	}, [filteredTransactions, categories, filter, periodType, currentPeriod, formater]);

	const categorySpendDetails = useMemo(() => {
		const categorySpend: Record<string, {
			category: Category;
			total: number;
		}> = {};

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

	const groupedTransactions = useMemo(() => Object.entries(groupBy(filteredTransactions, transaction => new Date(transaction.date).toDateString())), [transactions, categories, filter, categoryFilter]);

	return (
		<>
			<Header className='justify-between'>
				<HeaderTitle>{t('insights.title')}</HeaderTitle>
				<PeriodNavigation
					defaultValue={periodType}
					onNextPeriod={nextPeriod}
					onPreviousPeriod={previousPeriod}
					onPeriodChange={setPeriodType}
				/>
			</Header>
			<Container>
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
						<Coins className='h-4 w-4'/>
						<AlertTitle>{t('transaction.noTransactions.title')}</AlertTitle>
						<AlertDescription>{t('transaction.noTransactions.description')}</AlertDescription>
					</Alert>
				)}
			</Container>
		</>
	);
}

Component.displayName = 'Insights';
