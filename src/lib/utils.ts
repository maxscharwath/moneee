import {type ClassValue, clsx} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function groupBy<T>(xs: T[], key: keyof T | ((x: T) => string)) {
	return xs.reduce<Record<string, T[]>>((rv, x) => {
		const k = (typeof key === 'function' ? key(x) : x[key]) as string;
		(rv[k] = rv[k] ?? []).push(x);
		return rv;
	}, {});
}

export const parseNumberFromString = (str: string): number | null => {
	const normalizedString = str
		.replace(/[^0-9.,']/g, '')
		.replace(/'/g, '')
		.replace(',', '.');
	const matched = /(\d+(\.\d)?)/.exec(normalizedString);
	return matched ? parseFloat(matched[0]) : null;
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
