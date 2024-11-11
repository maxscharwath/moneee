import { addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { createDatabase, lazyInitialize } from '@/stores/utils/createDatabase';
import { TransactionSchema } from '@/stores/schemas/transaction';
import { CategorySchema } from '@/stores/schemas/category';
import { SettingsSchema } from '@/stores/schemas/settings';
import { seeder } from '@/stores/seeder';
import { RecurrenceSchema } from '@/stores/schemas/recurrence';

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
            recurrences: { schema: RecurrenceSchema },
        },
    });

    await seeder(db);
    return db;
});

export type Database = Awaited<ReturnType<typeof initializeDb>>;
