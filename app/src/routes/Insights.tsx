import { CategoryChart } from "@/components/category-chart";
import { Chart } from "@/components/chart";
import { Container } from "@/components/container";
import { Currency } from "@/components/currency";
import { FinanceButton } from "@/components/finance-button";
import { Header, HeaderTitle } from "@/components/header";
import { PeriodNavigation } from "@/components/period-navigation";
import { TransactionGroup } from "@/components/transaction-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import { usePeriod, usePeriodTitle } from "@/hooks/usePeriod";
import { deleteRecurrence } from "@/hooks/useRecurrence";
import { deleteTransaction } from "@/hooks/useTransaction";
import { useLocale } from "@/i18n";
import { cn, groupBy } from "@/lib/utils";
import type { Category } from "@/stores/schemas/category";
import type { Transaction } from "@/stores/schemas/transaction";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, CoinsIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { match } from "ts-pattern";
import { Virtualizer } from "virtua";

type Filter = "income" | "expense" | "all";

export function Component() {
	const { t, formatter } = useLocale();
	const [filter, setFilter] = useState<Filter>("all");
	const [categoriesFilter, setCategoriesFilter] = useState<string[]>([]);

	const {
		currentPeriod,
		periodType,
		setPeriodType,
		nextPeriod,
		previousPeriod,
		getPeriodDates: [startDate, endDate],
		getPreviousPeriodDates: [previousStartDate, previousEndDate],
	} = usePeriod();

	useEffect(() => {
		setCategoriesFilter([]);
	}, [currentPeriod, periodType]);

	const { transactions, categories, totalIncome, totalExpenses, total } =
		useFinancialSummary(startDate, endDate);
	const { total: previousTotal } = useFinancialSummary(
		previousStartDate,
		previousEndDate,
	);

	const percentageChange = useMemo(() => {
		if (previousTotal === 0) {
			return total === 0 ? 0 : 100;
		}

		return ((total - previousTotal) / Math.abs(previousTotal)) * 100;
	}, [total, previousTotal]);

	const filteredTransactions = useMemo(() => {
		return transactions.filter((transaction) => {
			// Check if the transaction passes the 'filter' condition
			const matchesTypeFilter =
				filter === "all" ||
				categories.get(transaction.categoryId)?.type === filter;

			// Check if the transaction's categoryId is included in the categoriesFilter array
			const matchesCategoryFilter =
				!categoriesFilter.length ||
				categoriesFilter.includes(transaction.categoryId);

			// Return true only if both conditions are met
			return matchesTypeFilter && matchesCategoryFilter;
		});
	}, [transactions, categories, filter, categoriesFilter]);

	const getDaysInPeriod = useCallback(
		(periodType: string, date: Date): number => {
			switch (periodType) {
				case "weekly":
					return 7;
				case "yearly":
					return 365 + (date.getFullYear() % 4 === 0 ? 1 : 0); // Accounting for leap year
				default:
					return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); // Getting the last day of the month
			}
		},
		[],
	);

	const filterTransactionAmount = useCallback(
		(transaction: Transaction): number => {
			const transactionType = categories.get(transaction.categoryId)?.type;
			return filter === "all" || filter === transactionType
				? transaction.amount
				: 0;
		},
		[categories, filter],
	);

	const generateDateForDayIndex = (
		dayIndex: number,
		periodType: string,
		currentPeriod: Date,
	): Date =>
		match(periodType)
			.with("weekly", () => {
				const startOfWeek = new Date(currentPeriod);
				startOfWeek.setDate(currentPeriod.getDate() - currentPeriod.getDay());
				return new Date(
					startOfWeek.getFullYear(),
					startOfWeek.getMonth(),
					startOfWeek.getDate() + dayIndex,
				);
			})
			.with("yearly", () => new Date(currentPeriod.getFullYear(), dayIndex, 1))
			.with(
				"monthly",
				() =>
					new Date(
						currentPeriod.getFullYear(),
						currentPeriod.getMonth(),
						dayIndex + 1,
					),
			)
			.otherwise(() => currentPeriod);

	const chartData = useMemo(() => {
		if (periodType === "yearly") {
			return Array.from({ length: 12 }, (_, monthIndex) => {
				const transactionsInThisMonth = filteredTransactions.filter((t) => {
					const transactionDate = new Date(t.date);
					return (
						transactionDate.getFullYear() === currentPeriod.getFullYear() &&
						transactionDate.getMonth() === monthIndex
					);
				});

				const categoryTotals = transactionsInThisMonth.reduce(
					(acc, transaction) => {
						const category = categories.get(transaction.categoryId);
						if (category) {
							if (!acc[category.uuid]) {
								acc[category.uuid] = {
									category,
									total: 0,
								};
							}
							acc[category.uuid].total += transaction.amount;
						}
						return acc;
					},
					{} as Record<string, { category: Category; total: number }>,
				);

				return {
					name: formatter.date(
						new Date(currentPeriod.getFullYear(), monthIndex),
						{
							month: "short",
						},
					),
					total: transactionsInThisMonth.reduce(
						(acc, transaction) => acc + filterTransactionAmount(transaction),
						0,
					),
					categories: Object.values(categoryTotals),
				};
			});
		}

		const daysInPeriod = getDaysInPeriod(periodType, currentPeriod);

		return Array.from({ length: daysInPeriod }, (_, dayIndex) => {
			const date = generateDateForDayIndex(dayIndex, periodType, currentPeriod);
			const transactionsOnThisDay = filteredTransactions.filter(
				(t) => new Date(t.date).getDate() === date.getDate(),
			);

			const categoryTotals = transactionsOnThisDay.reduce(
				(acc, transaction) => {
					const category = categories.get(transaction.categoryId);
					if (category) {
						if (!acc[category.uuid]) {
							acc[category.uuid] = {
								category,
								total: 0,
							};
						}
						acc[category.uuid].total += transaction.amount;
					}
					return acc;
				},
				{} as Record<string, { category: Category; total: number }>,
			);

			return {
				name: formatter.date(date, { day: "2-digit" }),
				total: transactionsOnThisDay.reduce(
					(acc, transaction) => acc + filterTransactionAmount(transaction),
					0,
				),
				categories: Object.values(categoryTotals),
			};
		});
	}, [
		filteredTransactions,
		categories,
		periodType,
		currentPeriod,
		formatter,
		getDaysInPeriod,
		filterTransactionAmount,
	]);

	const categorySpendDetails = useMemo(() => {
		const categorySpend: Record<
			string,
			{
				category: Category;
				total: number;
			}
		> = {};

		for (const transaction of transactions) {
			const category = categories.get(transaction.categoryId);
			if (filter === category?.type) {
				categorySpend[category.uuid] = {
					total:
						(categorySpend[category.uuid]?.total || 0) + transaction.amount,
					category,
				};
			}
		}

		return Object.values(categorySpend);
	}, [transactions, categories, filter]);

	const groupedTransactions = useMemo(
		() =>
			Object.entries(
				groupBy(filteredTransactions, (transaction) =>
					new Date(transaction.date).toDateString(),
				),
			),
		[filteredTransactions],
	);

	const handleTransactionDelete = async (transaction: Transaction) => {
		if (transaction.recurrence) {
			await deleteRecurrence(transaction.recurrence);
		} else {
			await deleteTransaction(transaction);
		}
	};

	const { averagePerPeriodLabel, averagePerPeriod } = useMemo(() => {
		const daysInPeriod = getDaysInPeriod(periodType, currentPeriod);
		const isYearly = periodType === "yearly";
		const periodKey = isYearly ? "PerMonth" : "PerDay";

		const { total, label } = match(filter)
			.with("income", () => ({
				total: totalIncome,
				label: `transaction.income${periodKey}`,
			}))
			.with("expense", () => ({
				total: totalExpenses,
				label: `transaction.spent${periodKey}`,
			}))
			.otherwise(() => ({
				total: totalIncome - totalExpenses,
				label: `transaction.average${periodKey}`,
			}));

		const averagePerPeriod = total / (isYearly ? 12 : daysInPeriod);

		return {
			averagePerPeriodLabel: t(label),
			averagePerPeriod,
		};
	}, [filter, periodType, totalExpenses, currentPeriod, t, getDaysInPeriod]);

	const showChart = filter !== "all" && filteredTransactions.length > 0;

	return (
		<>
			<Header className="justify-between">
				<HeaderTitle>{t("insights.title")}</HeaderTitle>
				<PeriodNavigation
					defaultValue={periodType}
					onNextPeriod={nextPeriod}
					onPreviousPeriod={previousPeriod}
					onPeriodChange={setPeriodType}
				/>
			</Header>
			<Container>
				<motion.div
					className="flex flex-col gap-2"
					drag="x"
					dragConstraints={{
						left: 0,
						right: 0,
					}}
					dragElastic={0.1}
					onDragEnd={(_event, { offset, velocity }) => {
						const swipe = Math.abs(offset.x) * velocity.x;
						const swipeThreshold = 10000;
						if (swipe < -swipeThreshold) {
							nextPeriod();
						} else if (swipe > swipeThreshold) {
							previousPeriod();
						}
					}}
				>
					<div className="flex items-center justify-between gap-2">
						<div className="flex flex-col">
							<span className="text-sm font-bold uppercase text-muted-foreground">
								{usePeriodTitle(periodType, currentPeriod)}
							</span>
							<div className="flex items-center gap-2">
								<Currency amount={total} className="text-xl font-bold" />
								{percentageChange !== 0 && (
									<span
										className={cn(
											"rounded-lg px-2 py-1 text-xs font-bold",
											percentageChange < 0
												? "bg-red-500/30 text-red-500"
												: "bg-green-500/30 text-green-500",
										)}
									>
										{percentageChange.toFixed()}%
									</span>
								)}
							</div>
						</div>
						<div className="flex flex-col text-right">
							<span className="text-sm font-bold uppercase text-muted-foreground">
								{averagePerPeriodLabel}
							</span>
							<Currency
								amount={averagePerPeriod}
								className="text-xl font-bold"
							/>
						</div>
					</div>
					<ToggleGroup.Root
						type="single"
						className="grid grid-cols-2 gap-2"
						value={filter}
						onValueChange={(f: Filter) => {
							setFilter(f || "all");
							setCategoriesFilter([]);
						}}
					>
						<ToggleGroup.Item value="income" asChild>
							<FinanceButton
								colorClass="bg-green-500/30 text-green-500"
								icon={<ArrowUpRight size={24} />}
								label={t("transaction.income")}
								amount={totalIncome}
							/>
						</ToggleGroup.Item>
						<ToggleGroup.Item value="expense" asChild>
							<FinanceButton
								colorClass="bg-red-500/30 text-red-500"
								icon={<ArrowDownRight size={24} />}
								label={t("transaction.expense")}
								amount={totalExpenses}
							/>
						</ToggleGroup.Item>
					</ToggleGroup.Root>
				</motion.div>
				<AnimatePresence>
					{showChart && (
						<motion.div
							initial={{
								opacity: 0,
								height: 0,
							}}
							animate={{
								opacity: 1,
								height: "auto",
							}}
							exit={{
								opacity: 0,
								height: 0,
							}}
						>
							<Chart data={chartData} />
							<CategoryChart
								data={categorySpendDetails}
								selected={categoriesFilter}
								onSelect={setCategoriesFilter}
							/>
						</motion.div>
					)}
				</AnimatePresence>
				{groupedTransactions.length > 0 ? (
					<Virtualizer startMargin={showChart ? 445 : 145}>
						{groupedTransactions.map(([date, transactions]) => (
							<TransactionGroup
								key={date}
								date={date}
								transactions={transactions}
								categories={categories}
								onTransactionLongPress={handleTransactionDelete}
							/>
						))}
					</Virtualizer>
				) : (
					<Alert align="center">
						<CoinsIcon className="h-4 w-4" />
						<AlertTitle>{t("transaction.noTransactions.title")}</AlertTitle>
						<AlertDescription>
							{t("transaction.noTransactions.description")}
						</AlertDescription>
					</Alert>
				)}
			</Container>
		</>
	);
}

Component.displayName = "Insights";
