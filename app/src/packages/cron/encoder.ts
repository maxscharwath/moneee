import type { CronExpression, CronValue } from "@/packages/cron/types";

const formatValue = (value: CronValue) => {
	switch (value.type) {
		case "number":
			return `${value.value}`;
		case "wildcard":
			return "*";
		case "step":
			return `*/${value.step}`;
		case "stepFrom":
			return `${value.from}/${value.step}`;
		case "stepRange":
			return `${value.from}-${value.to}/${value.step}`;
		case "range":
			return `${value.from}-${value.to}`;
		case "list":
			return value.values.join(",");
		default:
			throw new Error("Unknown CronValue type");
	}
};

export const cronExpressionToString = (cron: CronExpression): string => {
	return [
		formatValue(cron.minute),
		formatValue(cron.hour),
		formatValue(cron.dayOfMonth),
		formatValue(cron.month),
		formatValue(cron.dayOfWeek),
	].join(" ");
};
