import { QueryConstructor, useRxData } from 'rxdb-hooks';
import { type Recurrence } from '@/stores/schemas/recurrence';
import type { Optional } from '@/lib/utils';
import { initializeDb } from '@/stores/db';

export function getRecurrences(query: QueryConstructor<Recurrence>) {
    return useRxData<Recurrence>('recurrences', query);
}

export function getRecurrencesForPeriod(startDate: Date, endDate?: Date) {
    return getRecurrences((recurrence) =>
        recurrence.find({
            selector: {
                startDate: { $gte: startDate.toISOString() },
                ...(endDate && { startDate: { $lte: endDate.toISOString() } }),
                $or: [
                    { endDate: { $exists: false } },
                    { endDate: { $gte: startDate.toISOString() } },
                ],
            },
        })
    );
}

export async function addRecurrence(recurrence: Optional<Recurrence, 'uuid'>) {
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
        recurrences.map(({ uuid }) => uuid)
    );
}
