import {type ExtractDocumentTypeFromTypedRxJsonSchema, toTypedRxJsonSchema} from 'rxdb';

export const TransactionSchema = toTypedRxJsonSchema({
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
		categoryId: {
			type: 'string',
			ref: 'categories',
		},
	},
	required: ['uuid', 'note', 'amount', 'date', 'categoryId'],
} as const);

export type Transaction = ExtractDocumentTypeFromTypedRxJsonSchema<typeof TransactionSchema>;
