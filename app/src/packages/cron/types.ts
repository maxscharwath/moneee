export type NumberValue = {
	type: "number";
	value: number;
};
export type WildcardValue = {
	type: "wildcard";
};
export type StepValue = {
	type: "step";
	step: number;
};
export type StepFromValue = {
	type: "stepFrom";
	step: number;
	from: number;
};
export type StepRangeValue = {
	type: "stepRange";
	from: number;
	to: number;
	step: number;
};
export type RangeValue = {
	type: "range";
	from: number;
	to: number;
};
export type ListValue = {
	type: "list";
	values: number[];
};

export type CronValue =
	| NumberValue
	| WildcardValue
	| StepValue
	| StepFromValue
	| StepRangeValue
	| RangeValue
	| ListValue;

export type CronExpression = {
	minute: CronValue;
	hour: CronValue;
	dayOfMonth: CronValue;
	month: CronValue;
	dayOfWeek: CronValue;
};

export const ALIAS_MAP = {
	sun: "0",
	mon: "1",
	tue: "2",
	wed: "3",
	thu: "4",
	fri: "5",
	sat: "6",
	jan: "1",
	feb: "2",
	mar: "3",
	apr: "4",
	may: "5",
	jun: "6",
	jul: "7",
	aug: "8",
	sep: "9",
	oct: "10",
	nov: "11",
	dec: "12",
} as const;

export type AliasMap = keyof typeof ALIAS_MAP;
