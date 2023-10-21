import {selector, useRecoilValue, useSetRecoilState} from 'recoil';
import {TransactionSchema, type Transaction} from './models';
import {transactionState} from './atoms';
import {useMemo} from 'react';

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
		const validatedTransaction = TransactionSchema.parse(newTransaction);
		setTransactions(prev => [...prev, validatedTransaction].sort((a, b) => b.date.localeCompare(a.date)));
	};

	return {
		getTransactionsForPeriod: useMemo(() => (start: Date, end: Date) => transactions.filter(transaction => {
			const transactionDate = new Date(transaction.date);
			return transactionDate >= start && transactionDate <= end;
		}), [transactions]),
		getTransactionById: useRecoilValue(getTransactionById),
		addTransaction,
		transactions,
	};
};
