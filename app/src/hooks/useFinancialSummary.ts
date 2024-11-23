import { useMemo } from "react";
import { useCategories } from "@/hooks/useCategory";
import { getTransactions } from "@/hooks/useTransaction";
import { useRecurringTransactions } from "@/hooks/useRecurrence";
import type { Transaction } from "@/stores/schemas/transaction";
import type { Category } from "@/stores/schemas/category";

function calculateFinancialSummary(
	transactions: Transaction[],
	categoryMap: Map<string, Category>,
) {
	return transactions.reduce(
		(acc, transaction) => {
			const category = categoryMap.get(transaction.categoryId);
			const amount =
				category?.type === "expense" ? -transaction.amount : transaction.amount;

			return {
				totalIncome: acc.totalIncome + (amount > 0 ? amount : 0),
				totalExpenses: acc.totalExpenses + (amount < 0 ? -amount : 0),
				total: acc.total + amount,
			};
		},
		{ totalIncome: 0, totalExpenses: 0, total: 0 },
	);
}

// Main hook to retrieve and summarize financial data
export function useFinancialSummary(startDate: Date, endDate: Date) {
	const { result: transactionsResult = [] } = getTransactions((collection) =>
		collection.find({
			selector: {
				date: {
					$gte: startDate.toISOString(),
					$lte: endDate.toISOString(),
				},
			},
			sort: [{ date: "desc" }],
		}),
	);

	const recurringTransactions = useRecurringTransactions(startDate, endDate);

	const allTransactions = useMemo(() => {
		return [...transactionsResult, ...recurringTransactions].sort(
			(a, b) => Date.parse(a.date) - Date.parse(b.date),
		);
	}, [transactionsResult, recurringTransactions]);

	const { result: categories = [] } = useCategories();
	const categoryMap = useMemo(
		() => new Map(categories.map((category) => [category.uuid, category])),
		[categories],
	);

	const financialSummary = useMemo(() => {
		return calculateFinancialSummary(allTransactions, categoryMap);
	}, [allTransactions, categoryMap]);

	return {
		...financialSummary,
		transactions: allTransactions,
		categories: categoryMap,
	};
}
