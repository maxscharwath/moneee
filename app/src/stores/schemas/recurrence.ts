import {
	type ExtractDocumentTypeFromTypedRxJsonSchema,
	toTypedRxJsonSchema,
} from "rxdb";

export const RecurrenceSchema = toTypedRxJsonSchema({
	title: "recurrence",
	version: 0,
	type: "object",
	primaryKey: "uuid",
	properties: {
		uuid: {
			type: "string",
			final: true,
		},
		note: {
			type: "string",
		},
		amount: {
			type: "number",
		},
		startDate: {
			type: "string",
			format: "date-time",
		},
		endDate: {
			type: "string",
			format: "date-time",
		},
		cron: {
			type: "string",
		},
		categoryId: {
			type: "string",
			ref: "categories",
		},
	},
	required: ["uuid", "note", "amount", "startDate", "cron", "categoryId"],
	additionalProperties: false,
} as const);

export type Recurrence = ExtractDocumentTypeFromTypedRxJsonSchema<
	typeof RecurrenceSchema
>;
