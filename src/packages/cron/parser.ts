import { CronExpression } from './types';
import { parseCronValue } from './valueParser';

/**
 * Splits a cron expression string into its parts.
 *
 * @param cronString - The cron expression string.
 * @returns An array of strings representing each part of the cron expression.
 */
function tokenize(cronString: string): string[] {
    return cronString.split(/\s+/);
}

/**
 * Parses a cron expression string and returns a CronExpression object.
 *
 * @param cronString - The cron expression string.
 * @returns A CronExpression object with parsed values for each part.
 * @throws Error if the cron string is invalid.
 */
export function parseCronExpression(cronString: string): CronExpression {
    const tokens = tokenize(cronString);

    // Validate the token length (5 or 6 parts)
    if (tokens.length < 5 || tokens.length > 6) {
        throw new Error(
            `Invalid cron expression format. Expected 5 or 6 parts, but got ${tokens.length}.`
        );
    }

    // Parse each part of the cron expression
    const [minute, hour, dayOfMonth, month, dayOfWeek] = tokens.map(
        (token, index) => {
            switch (index) {
                case 0: // minute
                    return parseCronValue(token, 0, 59);
                case 1: // hour
                    return parseCronValue(token, 0, 23);
                case 2: // day of month
                    return parseCronValue(token, 1, 31);
                case 3: // month
                    return parseCronValue(token, 1, 12);
                case 4: // day of week
                    return parseCronValue(token, 0, 6);
                default:
                    throw new Error('Unexpected cron field index');
            }
        }
    );

    // Construct and return the parsed CronExpression object
    return {
        minute,
        hour,
        dayOfMonth,
        month,
        dayOfWeek,
    };
}
