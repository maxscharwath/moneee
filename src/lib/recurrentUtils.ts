/**
 * Generates a cron expression for daily recurrence at a specific time.
 * @param hour - The hour (0-23) at which the recurrence should occur.
 * @param minute - The minute (0-59) at which the recurrence should occur.
 * @returns A cron expression for daily recurrence.
 */
export function dailyCron(hour: number, minute: number = 0): string {
    return `${minute} ${hour} * * *`;
}

/**
 * Generates a cron expression for weekly recurrence on a specific day and time.
 * @param dayOfWeek - The day of the week (0 = Sunday, 6 = Saturday).
 * @param hour - The hour (0-23) at which the recurrence should occur.
 * @param minute - The minute (0-59) at which the recurrence should occur.
 * @returns A cron expression for weekly recurrence.
 */
export function weeklyCron(
    dayOfWeek: number,
    hour: number,
    minute: number = 0
): string {
    return `${minute} ${hour} * * ${dayOfWeek}`;
}

/**
 * Generates a cron expression for monthly recurrence on a specific day and time.
 * @param dayOfMonth - The day of the month (1-31) for the recurrence.
 * @param hour - The hour (0-23) at which the recurrence should occur.
 * @param minute - The minute (0-59) at which the recurrence should occur.
 * @returns A cron expression for monthly recurrence.
 */
export function monthlyCron(
    dayOfMonth: number,
    hour: number = 0,
    minute: number = 0
): string {
    return `${minute} ${hour} ${dayOfMonth} * *`;
}

/**
 * Generates a cron expression for yearly recurrence on a specific month, day, and time.
 * @param month - The month (1-12) for the recurrence.
 * @param dayOfMonth - The day of the month (1-31) for the recurrence.
 * @param hour - The hour (0-23) at which the recurrence should occur.
 * @param minute - The minute (0-59) at which the recurrence should occur.
 * @returns A cron expression for yearly recurrence.
 */
export function yearlyCron(
    month: number,
    dayOfMonth: number,
    hour: number = 0,
    minute: number = 0
): string {
    return `${minute} ${hour} ${dayOfMonth} ${month} *`;
}

/**
 * Generates a cron expression for a custom recurrence interval.
 * @param intervalInDays - The number of days between each recurrence.
 * @param hour - The hour (0-23) at which the recurrence should occur.
 * @param minute - The minute (0-59) at which the recurrence should occur.
 * @returns A cron expression for custom interval recurrence.
 */
export function customIntervalCron(
    intervalInDays: number,
    hour: number,
    minute: number = 0
): string {
    if (intervalInDays < 1 || intervalInDays > 31) {
        throw new Error('Custom interval should be between 1 and 31 days.');
    }
    return `${minute} ${hour} */${intervalInDays} * *`;
}

function getLastDayOfMonth(year: number, month: number): number {
    return new Date(Date.UTC(year, month + 1, 0)).getUTCDate(); // Gets the last day of the month
}

/**
 * Parses a simplified cron string and calculates the next occurrence date.
 * @param cronString - The cron string (format: "minute hour day month dayOfWeek").
 * @param fromDate - The date from which to start looking for the next occurrence.
 * @returns The next date matching the cron expression, or null if invalid.
 */
export function getNextCronDate(
    fromDate: Date,
    cronString: string
): Date | null {
    const [minutePart, hourPart, dayPart, monthPart, dayOfWeekPart] =
        cronString.split(' ');

    // Clone the fromDate and work in UTC
    const nextDate = new Date(fromDate.getTime());
    nextDate.setUTCSeconds(0, 0); // Clear seconds and milliseconds

    while (true) {
        // Set minutes and hours
        nextDate.setUTCMinutes(
            minutePart === '*' ? nextDate.getUTCMinutes() : parseInt(minutePart)
        );
        nextDate.setUTCHours(
            hourPart === '*' ? nextDate.getUTCHours() : parseInt(hourPart)
        );

        // Adjust month directly if specified
        if (monthPart !== '*') {
            const month = parseInt(monthPart) - 1; // Cron month is 1-12; JS Date month is 0-11
            if (nextDate.getUTCMonth() > month) {
                nextDate.setUTCFullYear(nextDate.getUTCFullYear() + 1);
            }
            nextDate.setUTCMonth(month);
        }

        // Adjust day of the month with boundary check
        if (dayPart !== '*') {
            const day = parseInt(dayPart);
            const lastDayOfMonth = getLastDayOfMonth(
                nextDate.getUTCFullYear(),
                nextDate.getUTCMonth()
            );

            // If the cron day exceeds the last day of the month, set to the last day
            if (day > lastDayOfMonth) {
                nextDate.setUTCDate(lastDayOfMonth);
            } else {
                nextDate.setUTCDate(day);
            }
        }

        // Adjust to the specified day of the week
        if (dayOfWeekPart !== '*') {
            const targetDayOfWeek = parseInt(dayOfWeekPart);
            let daysToAdd = (targetDayOfWeek - nextDate.getUTCDay() + 7) % 7;
            if (daysToAdd === 0 && nextDate <= fromDate) daysToAdd = 7; // Move to the next week if on the same day
            nextDate.setUTCDate(nextDate.getUTCDate() + daysToAdd);
        }

        // Final check: If nextDate <= fromDate, adjust nextDate accordingly
        if (nextDate <= fromDate) {
            if (dayPart !== '*') {
                // Advance to the next month
                nextDate.setUTCDate(1); // Reset to the first day to prevent overflow
                nextDate.setUTCMonth(nextDate.getUTCMonth() + 1);
            } else {
                // Advance to the next day
                nextDate.setUTCDate(nextDate.getUTCDate() + 1);
            }
            // Continue the loop to adjust nextDate again
            continue;
        }

        // If nextDate > fromDate, return nextDate
        break;
    }

    return nextDate;
}

/**
 * Parameters for generating recurrence dates with cron scheduling.
 */
type GenerateRecurrenceParams = {
    startDate: Date; // The starting date for generating recurrence dates
    endDate: Date; // The upper bound date for generating recurrence dates
    cronString: string; // The cron string defining the recurrence pattern
    inclusiveStart?: boolean; // Whether the start date is inclusive (default: true)
    inclusiveEnd?: boolean; // Whether the end date is inclusive (default: false)
};

/**
 * Generates an iterator of recurrence dates based on a cron schedule and specified parameters.
 * The iterator will yield dates that match the cron pattern, within the specified range.
 *
 * @param params - An object containing start date, end date, cron string, and optional inclusivity settings.
 * @yields {Date} - Each date that matches the cron schedule, within the specified range.
 * @throws {Error} - Throws an error if endDate is not after startDate.
 */
export function* generateRecurrenceDates({
    startDate,
    endDate,
    cronString,
    inclusiveStart = true,
    inclusiveEnd = false,
}: GenerateRecurrenceParams): Generator<Date> {
    if (startDate >= endDate)
        throw new Error('End date must be after start date.');

    let currentDate = getNextCronDate(startDate, cronString);

    // Skip the initial date if inclusiveStart is false
    if (!inclusiveStart && currentDate && currentDate >= startDate) {
        currentDate = getNextCronDate(
            new Date(currentDate.getTime() + 1),
            cronString
        );
    }

    // Yield dates within the specified end date inclusivity range
    while (
        currentDate &&
        (inclusiveEnd ? currentDate <= endDate : currentDate < endDate)
    ) {
        yield currentDate;
        currentDate = getNextCronDate(
            new Date(currentDate.getTime() + 1),
            cronString
        );
    }
}
