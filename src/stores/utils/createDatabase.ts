import {
	createRxDatabase,
	type ExtractDocumentTypeFromTypedRxJsonSchema,
	type RxCollection, type RxCollectionCreator,
} from 'rxdb';

export const lazyInitialize = <A extends any[], R> (fn: (...args: A) => R) => {
	let value: R;
	return (...args: A) => value ?? (value = fn(...args));
};

export const createDatabase = async <Collections extends Record<string, RxCollectionCreator>> ({
	collections,
	...config
}: {
	collections: Collections;
} & Parameters<typeof createRxDatabase>[0]) => {
	const db = await createRxDatabase<{
		[key in keyof Collections]: RxCollection<ExtractDocumentTypeFromTypedRxJsonSchema<Collections[key]['schema']>>;
	}>(config);
	await db.addCollections(collections);

	return db;
};
