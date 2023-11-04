import {
	addRxPlugin,
	type ExtractDocumentTypeFromTypedRxJsonSchema,
	toTypedRxJsonSchema,
} from 'rxdb';
import {getRxStorageDexie} from 'rxdb/plugins/storage-dexie';
import {RxDBQueryBuilderPlugin} from 'rxdb/plugins/query-builder';
import {RxDBUpdatePlugin} from 'rxdb/plugins/update';
import {createDatabase, lazyInitialize} from '@/stores/createDatabase.ts';
import {useRxData} from 'rxdb-hooks';
import {type QueryConstructor} from 'rxdb-hooks/dist/useRxData';

export const TransactionSchemaTyped = toTypedRxJsonSchema({
	title: 'transaction',
	version: 0,
	type: 'object',
	primaryKey: 'uuid',
	properties: {
		uuid: {
			type: 'string',
			final: true,
		},
		note: {
			type: 'string',
		},
		amount: {
			type: 'number',
		},
		date: {
			type: 'string',
			format: 'date-time',
		},
		category_id: {
			type: 'string',
			ref: 'categories',
		},
	},
	required: ['uuid', 'note', 'amount', 'date', 'category_id'],
} as const);

export type Transaction = ExtractDocumentTypeFromTypedRxJsonSchema<typeof TransactionSchemaTyped>;

export const CategorySchemaTyped = toTypedRxJsonSchema({
	title: 'category',
	version: 0,
	type: 'object',
	primaryKey: 'uuid',
	properties: {
		uuid: {
			type: 'string',
			final: true,
		},
		name: {
			type: 'string',
		},
		color: {
			type: 'string',
		},
		icon: {
			type: 'string',
		},
		type: {
			type: 'string',
			enum: ['expense', 'income'],
			final: true,
		},
	},
	required: ['uuid', 'name', 'color', 'icon', 'type'],
	indexes: [['type', 'name']],
} as const);

export type Category = ExtractDocumentTypeFromTypedRxJsonSchema<typeof CategorySchemaTyped>;

export const initializeDb = lazyInitialize(async () => {
	addRxPlugin(RxDBUpdatePlugin);
	addRxPlugin(RxDBQueryBuilderPlugin);
	const db = await createDatabase({
		name: 'moneee-db',
		storage: getRxStorageDexie(),
		multiInstance: true,
		ignoreDuplicate: true,
		schemas: {
			transactions: TransactionSchemaTyped,
			categories: CategorySchemaTyped,
		},
	});

	const categories = [
		{uuid: '1e9c9877-bca3-4679-8121-6583d8def483', name: 'Food', color: '#FAD02E', icon: '🍔', type: 'expense'},
		{uuid: '48f67c28-4c6a-4bb1-b533-49db0f1a190f', name: 'Transportation', color: '#B2EBF2', icon: '🚗', type: 'expense'},
		{uuid: 'ba7567f8-5fe9-4d91-b9d8-2dbbf0c65b5e', name: 'Entertainment', color: '#CE93D8', icon: '🎮', type: 'expense'},
		{uuid: '0f08dcad-cf06-4b8b-8c8b-8b182cfdc34d', name: 'Salary', color: '#AED581', icon: '💰', type: 'income'},
		{uuid: 'a8c257b7-e6e7-4d3f-bfea-461d8f9205a1', name: 'Investment', color: '#FFCC80', icon: '📈', type: 'income'},
		{uuid: 'e4c5c7d3-4fb3-411b-835f-09b2d0c9e441', name: 'Gift', color: '#D1C4E9', icon: '🎁', type: 'income'},
		{uuid: 'fa5cfa0a-d7c9-4e6b-aa2d-0c5553b9c4e2', name: 'Other Income', color: '#C5E1A5', icon: '📦', type: 'income'},
		{uuid: '2a2c2b2d-3b3c-4d4e-5f5g-6h6i6j6k6l6m', name: 'Other Expense', color: '#FFAB91', icon: '📦', type: 'expense'},
	] satisfies Category[];
	await db.categories.bulkInsert(categories);

	await db.transactions.bulkInsert([
		{uuid: 'e3f3d7b2-b0b2-4f5b-9a1a-63de3a4e0bc2', note: 'Dinner at Restaurant', amount: 150, date: '2023-01-10T18:30:00Z', category_id: '1e9c9877-bca3-4679-8121-6583d8def483'},
		{uuid: '4448a0b5-c0d0-4a6a-b344-cdf4442a9a6d', note: 'Monthly Train Pass', amount: 300, date: '2023-02-15T09:20:00Z', category_id: '48f67c28-4c6a-4bb1-b533-49db0f1a190f'},
		{uuid: '6e5f5033-c9d3-411e-a40f-c2c5db7e6e5f', note: 'Cinema', amount: 25, date: '2023-02-18T20:45:00Z', category_id: 'ba7567f8-5fe9-4d91-b9d8-2dbbf0c65b5e'},
		{uuid: '3f4d5033-e9d3-511e-b40f-d2d5db7e7e5g', note: 'Monthly Salary', amount: 7500, date: '2023-02-28T12:00:00Z', category_id: '0f08dcad-cf06-4b8b-8c8b-8b182cfdc34d'},
		{uuid: '756f6432-a2d2-411e-b12f-e2c5da6e8e5g', note: 'Groceries', amount: 180.50, date: '2023-03-05T17:15:00Z', category_id: '1e9c9877-bca3-4679-8121-6583d8def483'},
		{uuid: '82f654c2-a7e2-411e-a15f-e3c4da7e9e5h', note: 'New Shoes', amount: 120, date: '2023-03-10T14:20:00Z', category_id: 'ba7567f8-5fe9-4d91-b9d8-2dbbf0c65b5e'},
		{uuid: '93a6b532-b7d2-411e-b17f-d3c5dabefe5h', note: 'Utilities Bill', amount: 200, date: '2023-03-15T10:05:00Z', category_id: '2a2c2b2d-3b3c-4d4e-5f5g-6h6i6j6k6l6m'},
		{uuid: 'a3b6c642-c8d2-411e-c18f-c3c6cabf8e5i', note: 'Birthday Gift', amount: 50, date: '2023-03-20T16:45:00Z', category_id: 'e4c5c7d3-4fb3-411b-835f-09b2d0c9e441'},
		{uuid: 'b3c7d652-d9e2-411e-d19f-b3b7dacf9e5j', note: 'Cafe with Friends', amount: 30, date: '2023-03-25T11:25:00Z', category_id: '1e9c9877-bca3-4679-8121-6583d8def483'},
		{uuid: 'c3d8e662-eaf2-411e-e1af-c3d8eaf2f2k2', note: 'Fuel', amount: 60, date: '2023-04-01T09:30:00Z', category_id: '48f67c28-4c6a-4bb1-b533-49db0f1a190f'},
		{uuid: 'd3e9f672-fbf2-411e-f1bf-d3e9fbf2g2l2', note: 'Gym Membership', amount: 45, date: '2023-04-05T15:40:00Z', category_id: 'ba7567f8-5fe9-4d91-b9d8-2dbbf0c65b5e'},
		{uuid: 'e3fa0872-gcg2-411e-g1cg-e3fa0gcgh2m2', note: 'Investment Returns', amount: 210, date: '2023-04-10T10:20:00Z', category_id: 'a8c257b7-e6e7-4d3f-bfea-461d8f9205a1'},
		{uuid: 'f3fb1972-hdh2-411e-h1dh-f3fb1hdi2n2n', note: 'Mobile Bill', amount: 35, date: '2023-04-15T12:15:00Z', category_id: '2a2c2b2d-3b3c-4d4e-5f5g-6h6i6j6k6l6m'},
		{uuid: '10ga2a82-idj2-411e-i1ij-10ga2ijj3o3o', note: 'Lunch at Work', amount: 15, date: '2023-04-20T13:05:00Z', category_id: '1e9c9877-bca3-4679-8121-6583d8def483'},
		{uuid: '20hb3b92-jek2-411e-j1jk-20hb3jkj4p4p', note: 'Tax Refund', amount: 250, date: '2023-04-25T10:55:00Z', category_id: '0f08dcad-cf06-4b8b-8c8b-8b182cfdc34d'},
		{uuid: '30ic4ca2-kfl2-411e-k1kl-30ic4klk5q5q', note: 'Night Out', amount: 60, date: '2023-04-30T21:30:00Z', category_id: 'ba7567f8-5fe9-4d91-b9d8-2dbbf0c65b5e'},
		{uuid: '40jd5db2-lgm2-411e-l1lm-40jd5lml6r6r', note: 'Dental Checkup', amount: 85, date: '2023-05-05T15:50:00Z', category_id: '2a2c2b2d-3b3c-4d4e-5f5g-6h6i6j6k6l6m'},
		{uuid: '50ke6ec2-mhn2-411e-m1mn-50ke6mnm7s7s', note: 'Investment Deposit', amount: 300, date: '2023-05-10T16:00:00Z', category_id: 'a8c257b7-e6e7-4d3f-bfea-461d8f9205a1'},
		{uuid: '60lf7fd2-noo2-411e-n1no-60lf7ono8t8t', note: 'Charity Donation', amount: 50, date: '2023-05-15T11:45:00Z', category_id: 'e4c5c7d3-4fb3-411b-835f-09b2d0c9e441'},
		{uuid: '70mg8ge2-opq2-411e-o1op-70mg8opo9u9u', note: 'Health Insurance', amount: 150, date: '2023-05-20T10:10:00Z', category_id: '2a2c2b2d-3b3c-4d4e-5f5g-6h6i6j6k6l6m'},
	]);

	return db;
});

export type Database = Awaited<ReturnType<typeof initializeDb>>;

export function getTransactionsForPeriod(startDate: Date, endDate: Date) {
	return useRxData<Transaction>('transactions', transaction => transaction.find({
		selector: {
			date: {
				$gte: startDate.toISOString(),
				$lte: endDate.toISOString(),
			},
		},
	}));
}

export function getFilteredTransactions(query: QueryConstructor<Transaction>) {
	return useRxData<Transaction>('transactions', query);
}

export async function addTransaction(transaction: Omit<Transaction, 'uuid'>) {
	return initializeDb()
		.then(async db => db.collections.transactions.insert({
			...transaction,
			uuid: crypto.randomUUID(),
		}));
}

export function useCategories() {
	return useRxData<Category>('categories', category => category.find());
}

export function getCategoryById(id: string) {
	return useRxData<Category>('categories', category => category.findOne(id));
}

export function getCategoriesByType(type: 'expense' | 'income') {
	return useRxData<Category>('categories', category => category.find({
		selector: {
			type,
		},
	}));
}
