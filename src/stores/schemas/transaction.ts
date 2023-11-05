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
		category_id: {
			type: 'string',
			ref: 'categories',
		},
	},
	required: ['uuid', 'note', 'amount', 'date', 'category_id'],
} as const);

export type Transaction = ExtractDocumentTypeFromTypedRxJsonSchema<typeof TransactionSchema>;
