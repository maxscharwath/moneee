import {
	createRxDatabase,
	type ExtractDocumentTypeFromTypedRxJsonSchema,
	type RxCollection,
	type RxJsonSchema,
} from 'rxdb';

export const createDatabase = async <Schemas extends Record<string, RxJsonSchema<any>>> ({
	schemas,
	...config
}: {schemas: Schemas} & Parameters<typeof createRxDatabase>[0]) => {
	const db = await createRxDatabase<{
		[key in keyof Schemas]: RxCollection<ExtractDocumentTypeFromTypedRxJsonSchema<Schemas[key]>>;
	}>(config);

	await db.addCollections(Object.fromEntries(
		Object.entries(schemas)
			.map(([key, schema]) => [key, {schema}]),
	));

	return db;
};
