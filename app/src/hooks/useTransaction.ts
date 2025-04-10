import { type QueryConstructor, useRxData } from "rxdb-hooks";
import type { Transaction } from "@/stores/schemas/transaction";
import type { Optional } from "@/lib/utils";
import { initializeDb } from "@/stores/db";

export function useTransactions(query?: QueryConstructor<Transaction>) {
	return useRxData<Transaction>(
		"transactions",
		query ?? ((transaction) => transaction.find()),
	);
}

export async function addTransaction(
	transaction: Optional<Transaction, "uuid">,
) {
	const db = await initializeDb();
	return db.collections.transactions.upsert({
		...transaction,
		uuid: transaction.uuid ?? crypto.randomUUID(),
	});
}

export async function bulkAddTransactions(
	transactions: Optional<Transaction, "uuid">[],
) {
	const db = await initializeDb();
	return db.collections.transactions.bulkUpsert(
		transactions.map((transaction) => ({
			...transaction,
			uuid: transaction.uuid ?? crypto.randomUUID(),
		})),
	);
}

export async function deleteTransaction(
	...transactions: Array<{ uuid: string }>
) {
	const db = await initializeDb();
	return db.collections.transactions.bulkRemove(
		transactions.map(({ uuid }) => uuid),
	);
}
