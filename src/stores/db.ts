import { addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { createDatabase, lazyInitialize } from '@/stores/utils/createDatabase';
import { useRxData } from 'rxdb-hooks';
import { type QueryConstructor } from 'rxdb-hooks/dist/useRxData';
import {
    type Transaction,
    TransactionSchema,
} from '@/stores/schemas/transaction';
import { type Category, CategorySchema } from '@/stores/schemas/category';
import { type Settings, SettingsSchema } from '@/stores/schemas/settings';
import { type Optional } from '@/lib/utils';
import { seeder } from '@/stores/seeder';

export const initializeDb = lazyInitialize(async () => {
    addRxPlugin(RxDBUpdatePlugin);
    addRxPlugin(RxDBQueryBuilderPlugin);
    const db = await createDatabase({
        name: 'moneee-db',
        storage: getRxStorageDexie(),
        multiInstance: true,
        ignoreDuplicate: true,
        collections: {
            transactions: { schema: TransactionSchema },
            categories: { schema: CategorySchema },
            settings: { schema: SettingsSchema },
        },
    });

    await seeder(db);
    return db;
});

export type Database = Awaited<ReturnType<typeof initializeDb>>;

export function getTransactionsForPeriod(startDate: Date, endDate: Date) {
    return useRxData<Transaction>('transactions', (transaction) =>
        transaction.find({
            selector: {
                date: {
                    $gte: startDate.toISOString(),
                    $lte: endDate.toISOString(),
                },
            },
        })
    );
}

export function getFilteredTransactions(query: QueryConstructor<Transaction>) {
    return useRxData<Transaction>('transactions', query);
}

export async function addTransaction(
    transaction: Optional<Transaction, 'uuid'>
) {
    return initializeDb().then(async (db) =>
        db.collections.transactions.upsert({
            ...transaction,
            uuid: transaction.uuid ?? crypto.randomUUID(),
        })
    );
}

export async function addCategory(category: Optional<Category, 'uuid'>) {
    return initializeDb().then(async (db) =>
        db.collections.categories.upsert({
            ...category,
            uuid: category.uuid ?? crypto.randomUUID(),
        })
    );
}

export async function removeCategory(...categoryUuid: string[]) {
    return initializeDb().then(async (db) =>
        db.collections.categories.bulkRemove(categoryUuid)
    );
}

export function useCategories() {
    return useRxData<Category>('categories', (category) => category.find());
}

export function getCategoryById(id: string) {
    return useRxData<Category>('categories', (category) =>
        category.findOne(id)
    );
}

export function getCategoriesByType(type: 'expense' | 'income') {
    return useRxData<Category>('categories', (category) =>
        category.find({
            selector: {
                type,
            },
        })
    );
}

export function useSettings(): [
    Settings | null,
    (settings: Partial<Settings>) => void,
] {
    const { result } = useRxData<Settings>('settings', (settings) =>
        settings.findOne('settings')
    );
    return [
        result[0],
        (settings: Partial<Settings>) => {
            void result[0]?.incrementalPatch(settings);
        },
    ];
}

export async function deleteTransaction(
    ...transactions: Array<{ uuid: string }>
) {
    await (
        await initializeDb()
    ).transactions.bulkRemove(transactions.map(({ uuid }) => uuid));
}
