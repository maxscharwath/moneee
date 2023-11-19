import {
	createRxDatabase,
	type ExtractDocumentTypeFromTypedRxJsonSchema,
	type RxCollection,
	type RxCollectionCreator,
	type RxDatabase,
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
} & Parameters<typeof createRxDatabase>[0]): Promise<RxDatabase<{
	[key in keyof Collections]: RxCollection<ExtractDocumentTypeFromTypedRxJsonSchema<Collections[key]['schema']>>;
}>> => {
	const db = await createRxDatabase<{
		[key in keyof Collections]: RxCollection<ExtractDocumentTypeFromTypedRxJsonSchema<Collections[key]['schema']>>;
	}>(config);
	try {
		await db.addCollections(collections);
	} catch (e) {
		// Todo: use migration strategy
		console.error('Error while adding collections, trying to remove and recreate database', e);
		await db.remove();
		return createDatabase({collections, ...config});
	}

	return db;
};
