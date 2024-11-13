import { ALIAS_MAP, type AliasMap } from './types'

export function validateCronValue(
	part: string,
	min: number,
	max: number,
): number | null {
	const mappedPart = mapAlias(part);
	const num = Number.parseInt(mappedPart, 10);
	if (!Number.isNaN(num) && num >= min && num <= max) return num;
	return null;
}

export function mapAlias(alias: string | AliasMap): string {
	return ALIAS_MAP[alias.toLowerCase() as AliasMap] ?? alias;
}
