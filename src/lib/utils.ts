import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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

export function isNotNull<T>(value: Nullable<T>): value is T {
    return value != null;
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;

export type Nullable<T> = T | null | undefined;

export type MaybeNullable<T, U, V extends readonly Nullable<U>[]> = V extends [
    infer First,
    ...infer Rest extends readonly Nullable<U>[],
]
    ? First extends U
        ? T
        : MaybeNullable<T, U, Rest>
    : Nullable<T>;
