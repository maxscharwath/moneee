import { RecurrenceType } from '@/components/recurrence-select';
import { CronExpression } from '@/packages/cron/types';
import { cronExpressionToString } from '@/packages/cron/encoder';
import { parseCronExpression } from '@/packages/cron/parser';

export const generateCronExpression = (
    recurrenceType: RecurrenceType,
    date: Date
): string => {
    const cronExpression: CronExpression = {
        minute: { type: 'number', value: date.getMinutes() },
        hour: { type: 'number', value: date.getHours() },
        dayOfMonth:
            recurrenceType === 'monthly' || recurrenceType === 'yearly'
                ? { type: 'number', value: date.getDate() }
                : { type: 'wildcard' },
        month:
            recurrenceType === 'yearly'
                ? { type: 'number', value: date.getMonth() + 1 }
                : { type: 'wildcard' },
        dayOfWeek:
            recurrenceType === 'weekly'
                ? { type: 'number', value: date.getDay() }
                : { type: 'wildcard' },
    };

    return cronExpressionToString(cronExpression);
};

export const cronToRecurrenceType = (cron: string): RecurrenceType => {
    try {
        const parsedCron = parseCronExpression(cron);
        const { dayOfMonth, month, dayOfWeek } = parsedCron;

        if (
            dayOfMonth.type === 'wildcard' &&
            month.type === 'wildcard' &&
            dayOfWeek.type === 'wildcard'
        ) {
            return 'daily';
        }

        if (
            dayOfMonth.type === 'wildcard' &&
            month.type === 'wildcard' &&
            dayOfWeek.type === 'number'
        ) {
            return 'weekly';
        }

        if (
            dayOfMonth.type === 'number' &&
            month.type === 'wildcard' &&
            dayOfWeek.type === 'wildcard'
        ) {
            return 'monthly';
        }

        if (
            dayOfMonth.type === 'number' &&
            month.type === 'number' &&
            dayOfWeek.type === 'wildcard'
        ) {
            return 'yearly';
        }
    } catch {
        return 'none';
    }

    return 'none';
};
