// Helper function to parse CronValue into an array of valid numbers
import type { CronExpression, CronValue } from '@/packages/cron/types'

type ValidValues = {
	minute: number[];
	hour: number[];
	dayOfMonth: number[];
	month: number[];
	dayOfWeek: number[];
};

function parseCronValue(
	cronValue: CronValue,
	minValue: number,
	maxValue: number,
): number[] {
	const result = new Set<number>();

	switch (cronValue.type) {
		case "number":
			if (cronValue.value >= minValue && cronValue.value <= maxValue) {
				result.add(cronValue.value);
			}
			break;
		case "wildcard":
			for (let i = minValue; i <= maxValue; i++) {
				result.add(i);
			}
			break;
		case "step":
			for (let i = minValue; i <= maxValue; i += cronValue.step) {
				result.add(i);
			}
			break;
		case "stepFrom":
			for (let i = cronValue.from; i <= maxValue; i += cronValue.step) {
				if (i >= minValue && i <= maxValue) {
					result.add(i);
				}
			}
			break;
		case "stepRange":
			for (let i = cronValue.from; i <= cronValue.to; i += cronValue.step) {
				if (i >= minValue && i <= maxValue) {
					result.add(i);
				}
			}
			break;
		case "range":
			for (let i = cronValue.from; i <= cronValue.to; i++) {
				if (i >= minValue && i <= maxValue) {
					result.add(i);
				}
			}
			break;
		case "list":
			for (const value of cronValue.values) {
				if (value >= minValue && value <= maxValue) {
					result.add(value);
				}
			}
			break;
		default:
			throw new Error(`Unknown CronValue type: ${cronValue}`);
	}

	return Array.from(result).sort((a, b) => a - b);
}

// Function to get valid values for all fields in the CronExpression
function getValidValues(cronExpression: CronExpression): ValidValues {
	return {
		minute: parseCronValue(cronExpression.minute, 0, 59),
		hour: parseCronValue(cronExpression.hour, 0, 23),
		dayOfMonth: parseCronValue(cronExpression.dayOfMonth, 1, 31),
		month: parseCronValue(cronExpression.month, 1, 12),
		dayOfWeek: parseCronValue(cronExpression.dayOfWeek, 0, 6),
	};
}

// Helper function to get the next valid value from an array
function getNextValue(values: number[], currentValue: number): number | null {
	for (const value of values) {
		if (value > currentValue) {
			return value;
		}
	}
	return null;
}

export function* generateDates(
	cronExpression: CronExpression,
	startDate: Date,
	endDate?: Date,
): Generator<Date> {
	const validValues = getValidValues(cronExpression);
	let currentDate: Date | null = new Date(startDate.getTime());
	currentDate.setSeconds(0);
	currentDate.setMilliseconds(0);

	while (!endDate || currentDate <= endDate) {
		// Adjust to the next matching date
		currentDate = getNextMatchingDate(currentDate, validValues);
		if (!currentDate || (endDate && currentDate > endDate)) {
			break;
		}
		yield new Date(currentDate.getTime());
		currentDate.setMinutes(currentDate.getMinutes() + 1);
	}
}

// Function to find the next date matching the cron expression
function getNextMatchingDate(
	currentDate: Date,
	validValues: ValidValues,
): Date | null {
	// Copy the date
	const date = new Date(currentDate.getTime());

	// Loop until we find a matching date
	while (true) {
		// Check if month is valid
		const month = date.getMonth() + 1;
		if (!validValues.month.includes(month)) {
			// Move to the next valid month
			const nextMonth = getNextValue(validValues.month, month - 1);
			if (nextMonth === null) {
				// No valid month, move to next year
				date.setFullYear(date.getFullYear() + 1);
				date.setMonth(validValues.month[0] - 1);
				date.setDate(1);
				date.setHours(0);
				date.setMinutes(0);
				continue;
			}
			date.setMonth(nextMonth - 1);
			date.setDate(1);
			date.setHours(0);
			date.setMinutes(0);
			continue;
		}

		// Check if day is valid
		const day = date.getDate();
		const daysInMonth = new Date(
			date.getFullYear(),
			date.getMonth() + 1,
			0,
		).getDate();
		const validDays = validValues.dayOfMonth.filter((d) => d <= daysInMonth);
		if (!validDays.includes(day)) {
			// Move to the next valid day
			const nextDay = getNextValue(validDays, day);
			if (nextDay === null) {
				// No valid day in this month, move to next month
				date.setMonth(date.getMonth() + 1);
				date.setDate(1);
				date.setHours(0);
				date.setMinutes(0);
				continue;
			}
			date.setDate(nextDay);
			date.setHours(0);
			date.setMinutes(0);
			continue;
		}

		// Check if day of week is valid
		const dayOfWeek = date.getDay();
		if (!validValues.dayOfWeek.includes(dayOfWeek)) {
			// Move to next day
			date.setDate(date.getDate() + 1);
			date.setHours(0);
			date.setMinutes(0);
			continue;
		}

		// Check if hour is valid
		const hour = date.getHours();
		if (!validValues.hour.includes(hour)) {
			// Move to next valid hour
			const nextHour = getNextValue(validValues.hour, hour - 1);
			if (nextHour === null) {
				// No valid hour, move to next day
				date.setDate(date.getDate() + 1);
				date.setHours(validValues.hour[0]);
				date.setMinutes(0);
				continue;
			}
			date.setHours(nextHour);
			date.setMinutes(0);
			continue;
		}

		// Check if minute is valid
		const minute = date.getMinutes();
		if (!validValues.minute.includes(minute)) {
			// Move to next valid minute
			const nextMinute = getNextValue(validValues.minute, minute - 1);
			if (nextMinute === null) {
				// No valid minute, move to next hour
				date.setHours(date.getHours() + 1);
				date.setMinutes(validValues.minute[0]);
				continue;
			}
			date.setMinutes(nextMinute);
			continue;
		}

		// Found a matching date
		return date;
	}
}
