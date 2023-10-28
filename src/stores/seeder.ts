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
		name: 'Taxes',
		icon: '📝',
		color: '#EF4444',
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
		amount: 5707.05,
		date: new Date(2023, 9, 1).toISOString(),
		recurrence: {
			frequency: 'monthly',
			interval: 1,
		},
		categoryId: seedCategories[0].id,
	}),
	create(TransactionSchema, {
		name: 'Taxes',
		amount: 1000,
		date: new Date(2023, 9, 1).toISOString(),
		recurrence: {
			frequency: 'monthly',
			interval: 1,
		},
		categoryId: seedCategories[1].id,
	}),
	create(TransactionSchema, {
		name: 'Rent',
		amount: 500,
		date: new Date(2023, 9, 5).toISOString(),
		recurrence: {
			frequency: 'monthly',
			interval: 1,
		},
		categoryId: seedCategories[2].id,
	}),
	create(TransactionSchema, {
		name: 'Telephone Bill',
		amount: 130,
		date: new Date(2023, 9, 5).toISOString(),
		recurrence: {
			frequency: 'monthly',
			interval: 2,
		},
		categoryId: seedCategories[7].id,
	}),
	create(TransactionSchema, {
		name: 'Health Insurance',
		amount: 495,
		date: new Date(2023, 9, 5).toISOString(),
		recurrence: {
			frequency: 'monthly',
			interval: 1,
		},
		categoryId: seedCategories[6].id,
	}),
	create(TransactionSchema, {
		name: 'Groceries',
		amount: 20,
		date: new Date(2023, 9, 5).toISOString(),
		recurrence: {
			frequency: 'daily',
			interval: 1,
			days: {
				Monday: true,
				Tuesday: true,
				Wednesday: true,
				Thursday: true,
				Friday: true,
				Saturday: false,
				Sunday: false,
			},
		},
		categoryId: seedCategories[3].id,
	}),
	create(TransactionSchema, {
		name: 'Netflix',
		amount: 29,
		date: new Date(2023, 9, 5).toISOString(),
		recurrence: {
			frequency: 'monthly',
			interval: 1,
		},
		categoryId: seedCategories[13].id,
	}),
	create(TransactionSchema, {
		name: 'Spotify',
		amount: 10,
		date: new Date(2023, 9, 5).toISOString(),
		recurrence: {
			frequency: 'monthly',
			interval: 1,
		},
		categoryId: seedCategories[13].id,
	}),
	create(TransactionSchema, {
		name: 'Haircut',
		amount: 20,
		date: new Date(2023, 9, 5).toISOString(),
		recurrence: {
			frequency: 'weekly',
			interval: 3,
		},
		categoryId: seedCategories[9].id,
	}),
].sort((a, b) => b.date.localeCompare(a.date));
