import {atom} from 'recoil';
import {type Category, type Transaction} from './models';
import {seedCategories, seedTransactions} from '@/stores/seeder.ts';

export const categoryState = atom<Category[]>({
	key: 'categoryState',
	default: seedCategories,
});

export const transactionState = atom<Transaction[]>({
	key: 'transactionState',
	default: seedTransactions,
});
