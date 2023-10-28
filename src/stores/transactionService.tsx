import {selector, useRecoilValue, useSetRecoilState} from 'recoil';
import {useMemo} from 'react';
import {
	type Transaction,
	TransactionSchema,
	create,
	type Recurrence,
	type Days,
} from './models';
import {transactionState} from './atoms';

const getTransactionById = selector({
	key: 'getTransactionById',
	get: ({get}) => (id: string) => {
		const transactions = get(transactionState);
		return transactions.find(transaction => transaction.id === id);
	},
});

export const useTransactionService = () => {
	const transactions = useRecoilValue(transactionState);
	const setTransactions = useSetRecoilState(transactionState);

	const addTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
		const validatedTransaction = create(TransactionSchema, newTransaction);
		setTransactions(prev => [...prev, validatedTransaction].sort((a, b) => b.date.localeCompare(a.date)));
	};

	const getNextDate = (currentDate: Date, recurrence: Recurrence) => {
		const newDate = new Date(currentDate);

		switch (recurrence.frequency) {
			case 'daily':
				newDate.setDate(newDate.getDate() + recurrence.interval);
				if (recurrence.days) {
					while (!recurrence.days[newDate.toLocaleDateString('en-US', {weekday: 'long'}) as keyof Days]) {
						newDate.setDate(newDate.getDate() + 1);
					}
				}

				break;
			case 'weekly':
				newDate.setDate(newDate.getDate() + (7 * recurrence.interval));
				break;
			case 'monthly':
				newDate.setMonth(newDate.getMonth() + recurrence.interval);
				break;
			case 'yearly':
				newDate.setFullYear(newDate.getFullYear() + recurrence.interval);
				break;
			default:
				return null;
		}

		return newDate;
	};

	const generateRecurringTransactions = (transaction: Transaction, endDate: Date) => {
		if (!transaction.recurrence) {
			return [];
		}

		const recurringTransactions = [];
		let currentDate: Date | null = new Date(transaction.date);

		while (currentDate && currentDate <= endDate) {
			currentDate = getNextDate(currentDate, transaction.recurrence);

			if (currentDate && currentDate <= endDate) {
				recurringTransactions.push({
					...transaction,
					id: crypto.randomUUID(),
					date: currentDate.toISOString(),
				});
			}
		}

		return recurringTransactions;
	};

	return {
		getTransactionsForPeriod: useMemo(() => (start: Date, end: Date) => {
			// Filter one-time transactions that fall into the period.
			let relevantTransactions = transactions.filter(transaction => {
				const transactionDate = new Date(transaction.date);
				return !transaction.recurrence && transactionDate >= start && transactionDate <= end;
			});

			// Handle recurrence separately
			transactions.forEach(transaction => {
				if (transaction.recurrence) {
					const recurringTransactions = generateRecurringTransactions(transaction, end);

					// Filter out recurring transactions that might fall outside the given period due to interval and starting point
					const filteredRecurringTransactions = recurringTransactions.filter(recurringTransaction => {
						const recurringTransactionDate = new Date(recurringTransaction.date);
						return recurringTransactionDate >= start && recurringTransactionDate <= end;
					});

					relevantTransactions = relevantTransactions.concat(filteredRecurringTransactions);
				}
			});

			return relevantTransactions.sort((a, b) => b.date.localeCompare(a.date));
		}, [transactions]),
		getTransactionById: useRecoilValue(getTransactionById),
		addTransaction,
		transactions,
	};
};
