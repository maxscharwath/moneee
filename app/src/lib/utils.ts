import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function groupBy<T>(xs: T[], key: keyof T | ((x: T) => string)) {
	return xs.reduce<Record<string, T[]>>((rv, x) => {
		const k = typeof key === "function" ? key(x) : String(x[key]);
		if (!(k in rv)) {
			rv[k] = [];
		}
		rv[k].push(x);
		return rv;
	}, {});
}

export const parseNumberFromString = (str: string): number | null => {
	const normalizedString = str
		.replace(/[^0-9.,']/g, "")
		.replace(/'/g, "")
		.replace(",", ".");
	const matched = /(\d+(\.\d)?)/.exec(normalizedString);
	return matched ? Number.parseFloat(matched[0]) : null;
};

export type DateLike = Date | string | number;

export function isNotNull<T>(value: Nullable<T>): value is NotNull<T> {
	return value !== null && value !== undefined;
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

export type Nullable<T> = T | null | undefined;

export type NotNull<T> = Exclude<T, null | undefined>;

export type MaybeNullable<T, U, V extends readonly Nullable<U>[]> = V extends [
	infer First,
	...infer Rest extends readonly Nullable<U>[],
]
	? First extends U
		? T
		: MaybeNullable<T, U, Rest>
	: Nullable<T>;

export function formatNullable<T, R>(
	value: T,
	formatter: (value: NonNullable<T>) => R,
): T extends null | undefined ? undefined : R {
	if (value == null) {
		return undefined as T extends null | undefined ? undefined : R;
	}
	return formatter(value) as T extends null | undefined ? undefined : R;
}

export function take<T>(generator: Generator<T>, count: number): T[] {
	return Array.from({ length: count }, () => generator.next().value);
}

export const hashString = (str: string): number => {
	let hash = 0;
	const prime = 31; // A small prime number
	for (let i = 0; i < str.length; i++) {
		hash = hash * prime + str.charCodeAt(i) * 90;
		hash |= 0; // Convert to 32bit integer
	}
	return Math.abs(hash);
};

export const getPastelColorFromHash = (str: string): string => {
	const hash = hashString(str);
	const hue = hash % 360;
	const saturation = 70 + (hash % 10);
	const lightness = 65;
	return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
