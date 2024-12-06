import { getMostRecentDate, getOldestDate } from '@/lib/dateUtils'
import type { Optional } from '@/lib/utils'
import { initializeDb } from '@/stores/db'
import type { Recurrence } from '@/stores/schemas/recurrence'
import type { Transaction } from '@/stores/schemas/transaction'
import { generateDates, parseCronExpression } from '@moneee/cron'
import { useMemo } from 'react'
import { type QueryConstructor, useRxData } from 'rxdb-hooks'
import { v5 as uuidv5 } from 'uuid'

export function useRecurrences(query?: QueryConstructor<Recurrence>) {
	return useRxData<Recurrence>(
		"recurrences",
		query ?? ((recurrence) => recurrence.find()),
		{ json: true },
	);
}

export function useRecurrencesForPeriod(startDate: Date, endDate?: Date) {
	return useRecurrences((recurrence) =>
		recurrence.find({
			selector: {
				startDate: { $gte: startDate.toISOString() },
				...(endDate && { startDate: { $lte: endDate.toISOString() } }),
				$or: [
					{ endDate: { $exists: false } },
					{ endDate: { $gte: startDate.toISOString() } },
				],
			},
		}),
	);
}

export async function addRecurrence(recurrence: Optional<Recurrence, "uuid">) {
	const db = await initializeDb();
	return db.collections.recurrences.upsert({
		...recurrence,
		uuid: recurrence.uuid ?? crypto.randomUUID(),
	});
}

export async function deleteRecurrence(
	...recurrences: Array<{ uuid: string }>
) {
	const db = await initializeDb();
	return db.collections.recurrences.bulkRemove(
		recurrences.map(({ uuid }) => uuid),
	);
}

export function generateRecurringTransactions(
	recurrences: Recurrence[],
	startDate: Date,
	endDate: Date,
): Transaction[] {
	return recurrences.flatMap((recurrence) => {
		const cronDates = generateDates(
			parseCronExpression(recurrence.cron),
			getMostRecentDate(startDate, recurrence.startDate),
			getOldestDate(endDate, recurrence.endDate),
		);

		return Array.from(cronDates, (date) =>
			makeRecurringTransactions(recurrence, date),
		);
	});
}

function makeRecurringTransactions(
	recurrence: Recurrence,
	date: Date,
): Transaction {
	return {
		uuid: uuidv5(date.toISOString(), recurrence.uuid),
		amount: recurrence.amount,
		categoryId: recurrence.categoryId,
		date: date.toISOString(),
		note: recurrence.note,
		recurrence,
	};
}

export function useRecurringTransactions(startDate: Date, endDate: Date) {
	const { result: recurrences = [] } = useRecurrencesForPeriod(
		startDate,
		endDate,
	);

	return useMemo(
		() => generateRecurringTransactions(recurrences, startDate, endDate),
		[recurrences, startDate, endDate],
	);
}
