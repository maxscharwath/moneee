import {z} from 'zod';

export const CategorySchema = z.object({
	id: z.string()
		.default(() => crypto.randomUUID()),
	type: z.union([z.literal('income'), z.literal('expense')]),
	name: z.string(),
	icon: z.string(),
	color: z.string(),
});

export const TransactionSchema = z.object({
	id: z.string()
		.default(() => crypto.randomUUID()),
	categoryId: z.string(),
	name: z.string(),
	amount: z.number(),
	date: z.string(),
	recurrence: z.union([
		z.literal('once'),
		z.literal('daily'),
		z.literal('weekly'),
		z.literal('monthly'),
		z.literal('yearly'),
	]),
});

export type Category = z.infer<typeof CategorySchema>;
export type Transaction = z.infer<typeof TransactionSchema>;

export function create<U, T extends z.Schema<U>>(schema: T, data: Omit<z.infer<T>, 'id'>) {
	return schema.parse(data) as z.infer<T>;
}
