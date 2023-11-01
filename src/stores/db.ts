import {addRxPlugin, toTypedRxJsonSchema} from 'rxdb';
import {getRxStorageDexie} from 'rxdb/plugins/storage-dexie';
import {RxDBQueryBuilderPlugin} from 'rxdb/plugins/query-builder';
import {RxDBUpdatePlugin} from 'rxdb/plugins/update';
import {createDatabase} from '@/stores/createDatabase.ts';

export const TransactionSchemaTyped = toTypedRxJsonSchema({
	title: 'transaction',
	version: 0,
	type: 'object',
	primaryKey: 'uuid',
	properties: {
		uuid: {
			type: 'string',
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

export const CategorySchemaTyped = toTypedRxJsonSchema({
	title: 'category',
	version: 0,
	type: 'object',
	primaryKey: 'uuid',
	properties: {
		uuid: {
			type: 'string',
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
		},
	},
	required: ['uuid', 'name', 'color', 'icon', 'type'],
} as const);

(async () => {
	addRxPlugin(RxDBUpdatePlugin);
	addRxPlugin(RxDBQueryBuilderPlugin);
	const db = await createDatabase({
		name: 'rxdbdemo',
		storage: getRxStorageDexie(),
		multiInstance: true,
		ignoreDuplicate: true,
		schemas: {
			transactions: TransactionSchemaTyped,
			categories: CategorySchemaTyped,
		},
	});

	const categories = await db.collections.categories.bulkInsert([
		{uuid: crypto.randomUUID(), name: 'food', color: 'red', icon: '🍔', type: 'expense'},
		{uuid: crypto.randomUUID(), name: 'transport', color: 'blue', icon: '🚗', type: 'expense'},
		{uuid: crypto.randomUUID(), name: 'salary', color: 'green', icon: '💰', type: 'income'},
	]);

	await db.collections.transactions.bulkInsert([
		{uuid: crypto.randomUUID(), note: 'hello', amount: 10, date: new Date().toISOString(), category_id: categories.success[0].uuid},
		{uuid: crypto.randomUUID(), note: 'train', amount: 20, date: new Date().toISOString(), category_id: categories.success[1].uuid},
		{uuid: crypto.randomUUID(), note: 'world', amount: 30, date: new Date().toISOString(), category_id: categories.success[2].uuid},
	]);

	const transaction = await db.transactions
		.findOne({
			selector: {
				category_id: categories.success[0].uuid,
			},
		})
		.exec();

	const category = db.categories.findOne(transaction?.category_id);

	category.$.subscribe(category => {
		console.log('category', category?.toJSON());
	});

	await category.update({
		$set: {
			name: 'food2',
		},
	});

	console.log(transaction?.toJSON());
})();
