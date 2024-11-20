import { type MaybeNullable, type Nullable, isNotNull } from "@/lib/utils";

type DateLike = Date | string | number;

type MaybeNullableDate<D extends readonly Nullable<DateLike>[]> = MaybeNullable<
	Date,
	DateLike,
	D
>;

export function getMostRecentDate<D extends readonly Nullable<DateLike>[]>(
	...dates: D
): MaybeNullableDate<D> {
	const validDates = dates.filter(isNotNull).map((d) => new Date(d).getTime());

	if (validDates.length === 0) {
		return null as MaybeNullableDate<D>;
	}

	return new Date(Math.max(...validDates)) as MaybeNullableDate<D>;
}

export function getOldestDate<D extends readonly Nullable<DateLike>[]>(
	...dates: D
): MaybeNullableDate<D> {
	const validDates = dates.filter(isNotNull).map((d) => new Date(d).getTime());

	if (validDates.length === 0) {
		return null as MaybeNullableDate<D>;
	}

	return new Date(Math.min(...validDates)) as MaybeNullableDate<D>;
}
