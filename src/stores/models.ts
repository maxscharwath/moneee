import {z} from 'zod';

export const CategorySchema = z.object({
	id: z.string()
		.default(() => crypto.randomUUID()),
	type: z.union([z.literal('income'), z.literal('expense')]),
	name: z.string(),
	icon: z.string(),
	color: z.string(),
});

export const DaysSchema = z.object({
	Sunday: z.boolean(),
	Monday: z.boolean(),
	Tuesday: z.boolean(),
	Wednesday: z.boolean(),
	Thursday: z.boolean(),
	Friday: z.boolean(),
	Saturday: z.boolean(),
});

export const RecurrenceSchema = z.object({
	frequency: z.union([
		z.literal('daily'),
		z.literal('weekly'),
		z.literal('monthly'),
		z.literal('yearly'),
	]),
	interval: z.number().default(1),
	days: DaysSchema.optional(),
	endDate: z.string().optional(),
	occurrences: z.number().optional(),
});

export const TransactionSchema = z.object({
	id: z.string()
		.default(() => crypto.randomUUID()),
	categoryId: z.string(),
	name: z.string(),
	amount: z.number(),
	date: z.string(),
	recurrence: RecurrenceSchema.optional(),
});

export type Category = z.infer<typeof CategorySchema>;
export type Transaction = z.infer<typeof TransactionSchema>;
export type Recurrence = z.infer<typeof RecurrenceSchema>;
export type Days = z.infer<typeof DaysSchema>;

export function create<U, T extends z.Schema<U>>(schema: T, data: Omit<z.infer<T>, 'id'>) {
	return schema.parse(data) as z.infer<T>;
}
