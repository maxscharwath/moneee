import {
	type Category,
	CategorySchema,
	create,
	type Transaction,
	TransactionSchema,
} from '@/stores/models.ts';

export const seedCategories: Category[] = [
	create(CategorySchema, {
		type: 'income',
		name: 'Salary',
		icon: '💰',
		color: '#10B981',
	}),
	create(CategorySchema, {
		type: 'expense',
		name: 'Rent',
		icon: '🏠',
		color: '#F87171',
	}),
	create(CategorySchema, {
		type: 'expense',
		name: 'Groceries',
		icon: '🍎',
		color: '#bb2cb9',
	}),
	create(CategorySchema, {
		type: 'expense',
		name: 'Entertainment',
		icon: '🎉',
		color: '#FBBF24',
	}),
	create(CategorySchema, {
		type: 'expense',
		name: 'Transportation',
		icon: '🚗',
		color: '#F59E0B',
	}),
	create(CategorySchema, {
		type: 'expense',
		name: 'Health',
		icon: '🏥',
		color: '#EF4444',
	}),
	create(CategorySchema, {
		type: 'expense',
		name: 'Utilities',
		icon: '💡',
		color: '#3B82F6',
	}),
	create(CategorySchema, {
		type: 'expense',
		name: 'Dining Out',
		icon: '🍔',
		color: '#9333EA',
	}),
	create(CategorySchema, {
		type: 'expense',
		name: 'Clothing',
		icon: '👚',
		color: '#EC4899',
	}),
	create(CategorySchema, {
		type: 'expense',
		name: 'Travel',
		icon: '✈️',
		color: '#2563EB',
	}),
	create(CategorySchema, {
		type: 'expense',
		name: 'Electronics',
		icon: '📱',
		color: '#7C3AED',
	}),
	create(CategorySchema, {
		type: 'expense',
		name: 'Gifts',
		icon: '🎁',
		color: '#F43F5E',
	}),
	create(CategorySchema, {
		type: 'expense',
		name: 'Subscriptions',
		icon: '📺',
		color: '#9333EA',
	}),
	create(CategorySchema, {
		type: 'expense',
		name: 'Fitness',
		icon: '🏋️',
		color: '#F59E0B',
	}),
	create(CategorySchema, {
		type: 'expense',
		name: 'Education',
		icon: '📚',
		color: '#15803D',
	}),
	create(CategorySchema, {
		type: 'expense',
		name: 'Pets',
		icon: '🐾',
		color: '#4B5563',
	}),
	create(CategorySchema, {
		type: 'income',
		name: 'Investments',
		icon: '📈',
		color: '#F43F5E',
	}),
	create(CategorySchema, {
		type: 'income',
		name: 'Freelancing',
		icon: '💼',
		color: '#2A4365',
	}),
	create(CategorySchema, {
		type: 'income',
		name: 'Gifts Received',
		icon: '🎁',
		color: '#2F855A',
	}),
];

export const seedTransactions: Transaction[] = [
	create(TransactionSchema, {
		name: 'Salary',
		amount: 5707,
		date: new Date(2023, 9, 1).toISOString(),
		recurrence: 'monthly',
		categoryId: seedCategories[0].id,
	}),
	create(TransactionSchema, {
		name: 'Rent',
		amount: 1500,
		date: new Date(2023, 9, 5).toISOString(),
		recurrence: 'monthly',
		categoryId: seedCategories[1].id,
	}),
	create(TransactionSchema, {
		name: 'Groceries',
		amount: 200,
		date: new Date(2023, 9, 6).toISOString(),
		recurrence: 'daily',
		categoryId: seedCategories[2].id,
	}),
	create(TransactionSchema, {
		name: 'Entertainment',
		amount: 100,
		date: new Date(2023, 9, 7).toISOString(),
		recurrence: 'once',
		categoryId: seedCategories[3].id,
	}),
].sort((a, b) => b.date.localeCompare(a.date));
