import { useRxData } from "rxdb-hooks";
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

export function useCategories() {
	return useRxData<Category>("categories", (category) => category.find());
}

export function getCategoryById(id: string) {
	return useRxData<Category>("categories", (category) => category.findOne(id));
}

export function getCategoriesByType(type: "expense" | "income") {
	return useRxData<Category>("categories", (category) =>
		category.find({
			selector: {
				type,
			},
		}),
	);
}
