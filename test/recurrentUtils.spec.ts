import { describe, it, expect } from 'vitest';
import {
    customIntervalCron,
    dailyCron,
    generateRecurrenceDates,
    getNextCronDate,
    monthlyCron,
    weeklyCron,
    yearlyCron,
} from '../src/lib/recurrentUtils';

describe('Cron Expression Generators', () => {
    it('should generate a daily cron expression', () => {
        expect(dailyCron(10, 30)).toBe('30 10 * * *');
        expect(dailyCron(23)).toBe('0 23 * * *');
    });

    it('should generate a weekly cron expression', () => {
        expect(weeklyCron(1, 10, 30)).toBe('30 10 * * 1');
        expect(weeklyCron(5, 8)).toBe('0 8 * * 5');
    });

    it('should generate a monthly cron expression', () => {
        expect(monthlyCron(15, 8, 30)).toBe('30 8 15 * *');
        expect(monthlyCron(1, 0)).toBe('0 0 1 * *');
    });

    it('should generate a yearly cron expression', () => {
        expect(yearlyCron(12, 25, 0, 15)).toBe('15 0 25 12 *');
        expect(yearlyCron(6, 1)).toBe('0 0 1 6 *');
    });

    it('should generate a custom interval cron expression', () => {
        expect(customIntervalCron(5, 14)).toBe('0 14 */5 * *');
        expect(customIntervalCron(10, 9, 45)).toBe('45 9 */10 * *');
    });

    it('should throw an error for an invalid custom interval', () => {
        expect(() => customIntervalCron(32, 10)).toThrowError(
            'Custom interval should be between 1 and 31 days.'
        );
    });
});

describe('Next Date Calculation', () => {
    it('should calculate the next date based on daily cron expression', () => {
        const fromDate = new Date('2024-01-01T09:00:00Z');
        const cronString = '0 10 * * *'; // Every day at 10:00 AM
        const nextDate = getNextCronDate(fromDate, cronString);

        expect(nextDate?.toISOString()).toBe('2024-01-01T10:00:00.000Z');
    });

    it('should calculate the next date based on weekly cron expression', () => {
        const fromDate = new Date('2024-01-01T09:00:00Z'); // A Monday
        const cronString = '0 10 * * 1'; // Every Monday at 10:00 AM
        const nextDate = getNextCronDate(fromDate, cronString);

        expect(nextDate?.toISOString()).toBe('2024-01-01T10:00:00.000Z');
    });

    it('should calculate the next date based on monthly cron expression', () => {
        const fromDate = new Date('2024-01-01T09:00:00Z');
        const cronString = '0 10 15 * *'; // 15th day of every month at 10:00 AM
        const nextDate = getNextCronDate(fromDate, cronString);

        expect(nextDate?.toISOString()).toBe('2024-01-15T10:00:00.000Z');
    });

    it('should calculate the next date based on yearly cron expression', () => {
        const fromDate = new Date('2024-01-01T09:00:00Z');
        const cronString = '0 10 1 6 *'; // June 1st at 10:00 AM every year
        const nextDate = getNextCronDate(fromDate, cronString);

        expect(nextDate?.toISOString()).toBe('2024-06-01T10:00:00.000Z');
    });
});

describe('Recurrence Date Generation', () => {
    it('should generate a series of recurrence dates', () => {
        const params = {
            startDate: new Date('2024-01-01T00:00:00Z'),
            endDate: new Date('2024-01-15T23:59:59Z'),
            cronString: '0 10 * * 1', // Every Monday at 10:00 AM
        };

        const dates = Array.from(generateRecurrenceDates(params));
        const expectedDates = [
            '2024-01-01T10:00:00.000Z',
            '2024-01-08T10:00:00.000Z',
            '2024-01-15T10:00:00.000Z',
        ];

        expect(dates.map((date) => date.toISOString())).toEqual(expectedDates);
    });

    it('should generate a series of recurrence dates for a monthly cron expression', () => {
        const params = {
            startDate: new Date('2024-01-01T00:00:00Z'),
            endDate: new Date('2024-12-31T23:59:59Z'),
            cronString: '0 10 31 * *', // Every last day of the month at 10:00 AM
        };

        const dates = Array.from(generateRecurrenceDates(params));
        const expectedDates = [
            '2024-01-31T10:00:00.000Z',
            '2024-02-29T10:00:00.000Z', // Leap year
            '2024-03-31T10:00:00.000Z',
            '2024-04-30T10:00:00.000Z',
            '2024-05-31T10:00:00.000Z',
            '2024-06-30T10:00:00.000Z',
            '2024-07-31T10:00:00.000Z',
            '2024-08-31T10:00:00.000Z',
            '2024-09-30T10:00:00.000Z',
            '2024-10-31T10:00:00.000Z',
            '2024-11-30T10:00:00.000Z',
            '2024-12-31T10:00:00.000Z',
        ];

        expect(dates.map((date) => date.toISOString())).toEqual(expectedDates);
    });

    it('should not yield dates beyond the end date', () => {
        const params = {
            startDate: new Date('2024-01-01T00:00:00Z'),
            endDate: new Date('2024-01-08T10:00:00Z'), // Only the first Monday at 10:00 AM fits
            cronString: '0 10 * * 1', // Every Monday at 10:00 AM
            inclusiveEnd: false, // Ensure end date is exclusive
        };

        const dates = Array.from(generateRecurrenceDates(params));
        const expectedDates = ['2024-01-01T10:00:00.000Z'];

        expect(dates.map((date) => date.toISOString())).toEqual(expectedDates);
    });

    it('should include the end date if inclusiveEnd is true', () => {
        const params = {
            startDate: new Date('2024-01-01T00:00:00Z'),
            endDate: new Date('2024-01-08T10:00:00Z'), // The second Monday at 10:00 AM
            cronString: '0 10 * * 1', // Every Monday at 10:00 AM
            inclusiveEnd: true,
        };

        const dates = Array.from(generateRecurrenceDates(params));
        const expectedDates = [
            '2024-01-01T10:00:00.000Z',
            '2024-01-08T10:00:00.000Z',
        ];

        expect(dates.map((date) => date.toISOString())).toEqual(expectedDates);
    });

    it('should exclude the start date if inclusiveStart is false', () => {
        const params = {
            startDate: new Date('2024-01-01T00:00:00Z'),
            endDate: new Date('2024-01-15T10:00:00Z'),
            cronString: '0 10 * * 1', // Every Monday at 10:00 AM
            inclusiveStart: false,
        };

        const dates = Array.from(generateRecurrenceDates(params));
        const expectedDates = ['2024-01-08T10:00:00.000Z'];

        expect(dates.map((date) => date.toISOString())).toEqual(expectedDates);
    });
});

describe('End-of-Month Boundaries', () => {
    it('should adjust to the last day in February for leap years', () => {
        const fromDate = new Date('2024-02-01T00:00:00Z');
        const cronString = '0 10 31 * *'; // 31st day of each month at 10:00 AM

        const nextDate = getNextCronDate(fromDate, cronString);
        expect(nextDate?.toISOString()).toBe('2024-02-29T10:00:00.000Z'); // Leap year February
    });

    it('should adjust to the last day in February for non-leap years', () => {
        const fromDate = new Date('2023-02-01T00:00:00Z');
        const cronString = '0 10 31 * *'; // 31st day of each month at 10:00 AM

        const nextDate = getNextCronDate(fromDate, cronString);
        expect(nextDate?.toISOString()).toBe('2023-02-28T10:00:00.000Z'); // Non-leap year February
    });

    it('should adjust to the last day in months with 30 days', () => {
        const fromDate = new Date('2024-04-01T00:00:00Z');
        const cronString = '0 10 31 * *'; // 31st day of each month at 10:00 AM

        const nextDate = getNextCronDate(fromDate, cronString);
        expect(nextDate?.toISOString()).toBe('2024-04-30T10:00:00.000Z'); // April has 30 days
    });

    it('should work correctly for months with 31 days', () => {
        const fromDate = new Date('2024-05-01T00:00:00Z');
        const cronString = '0 10 31 * *'; // 31st day of each month at 10:00 AM

        const nextDate = getNextCronDate(fromDate, cronString);
        expect(nextDate?.toISOString()).toBe('2024-05-31T10:00:00.000Z'); // May has 31 days
    });
});
