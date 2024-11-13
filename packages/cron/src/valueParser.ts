import type {
	CronValue,
	ListValue,
	NumberValue,
	RangeValue,
	StepFromValue,
	StepValue,
	WildcardValue,
} from "./types";
import { mapAlias, validateCronValue } from "./validator";

function parseNumber(value: string, min: number, max: number): NumberValue {
	const num = validateCronValue(mapAlias(value), min, max);
	if (num === null)
		throw new Error(
			`Invalid number value "${value}". Must be between ${min} and ${max}.`,
		);
	return { type: "number", value: num };
}

function parseWildcard(): WildcardValue {
	return { type: "wildcard" };
}

function parseStep(
	value: string,
	min: number,
	max: number,
): StepValue | StepFromValue {
	const [baseStr, stepStr] = value.split("/");
	const baseMapped = mapAlias(baseStr);
	const step = Number.parseInt(stepStr, 10);

	if (baseMapped === "*") {
		return { type: "step", step };
	}

	const base = Number.parseInt(baseMapped, 10);
	const validatedBase = validateCronValue(baseMapped, min, max);

	if (validatedBase === null) {
		throw new Error(
			`Invalid step base "${base}". Must be between ${min} and ${max}.`,
		);
	}

	return {
		type: "stepFrom",
		from: validatedBase,
		step,
	};
}

function parseRange(value: string, min: number, max: number): RangeValue {
	const [from, to] = value
		.split("-")
		.map((part) => mapAlias(part))
		.map(Number);
	if (
		validateCronValue(String(from), min, max) === null ||
		validateCronValue(String(to), min, max) === null
	) {
		throw new Error(
			`Invalid range "${value}". Must be between ${min} and ${max}.`,
		);
	}
	return { type: "range", from, to };
}

function parseList(value: string, min: number, max: number): ListValue {
	const values = value.split(",").map((part) => {
		const mappedPart = mapAlias(part);
		const num = validateCronValue(mappedPart, min, max);
		if (num === null)
			throw new Error(
				`Invalid list value "${part}". Must be between ${min} and ${max}.`,
			);
		return num;
	});
	return { type: "list", values };
}

export function parseCronValue(
	value: string,
	min: number,
	max: number,
): CronValue {
	// Parse the value based on its format
	if (value === "*") return parseWildcard();
	if (value.includes("/")) return parseStep(value, min, max);
	if (value.includes("-")) return parseRange(value, min, max);
	if (value.includes(",")) return parseList(value, min, max);

	// Default to a single number value
	return parseNumber(value, min, max);
}
