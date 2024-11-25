import { type QueryConstructor, useRxData } from "rxdb-hooks";
import type { Category } from "@/stores/schemas/category";
import type { Optional } from "@/lib/utils";
import { initializeDb } from "@/stores/db";

export async function addCategory(category: Optional<Category, "uuid">) {
	const db = await initializeDb();
	return db.collections.categories.upsert({
		...category,
		uuid: category.uuid ?? crypto.randomUUID(),
	});
}

export async function removeCategory(...categoryUuid: string[]) {
	const db = await initializeDb();
	return db.collections.categories.bulkRemove(categoryUuid);
}

export function useCategories(query?: QueryConstructor<Category>) {
	return useRxData<Category>(
		"categories",
		query ?? ((category) => category.find()),
		{ json: true },
	);
}

export function useCategoryById(id: string) {
	return useCategories((category) => category.findOne(id));
}

export function useCategoriesByType(type: "expense" | "income") {
	return useCategories((category) =>
		category.find({
			selector: {
				type,
			},
		}),
	);
}
