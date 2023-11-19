import {useMemo, useState} from 'react';
import {useLocale} from '@/i18n';

export type PeriodType = 'weekly' | 'monthly' | 'yearly';

// A utility function to calculate the start and end dates for a given date and period type
const calculatePeriodDates = (date: Date, periodType: PeriodType): [Date, Date] => {
	let start;
	let end;
	switch (periodType) {
		case 'weekly':
			start = new Date(date);
			start.setDate(date.getDate() - date.getDay());
			end = new Date(start);
			end.setDate(start.getDate() + 6);
			break;
		case 'yearly':
			start = new Date(date.getFullYear(), 0, 1);
			end = new Date(date.getFullYear(), 11, 31);
			break;
		case 'monthly':
		default:
			start = new Date(date.getFullYear(), date.getMonth(), 1);
			end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
			break;
	}

	return [start, end];
};

// A utility function to shift the period based on the current period type
const shiftPeriod = (date: Date, periodType: PeriodType, direction: 'next' | 'previous'): Date => {
	const newDate = new Date(date);
	switch (periodType) {
		case 'weekly':
			newDate.setDate(date.getDate() + (direction === 'next' ? 7 : -7));
			break;
		case 'yearly':
			newDate.setFullYear(date.getFullYear() + (direction === 'next' ? 1 : -1));
			break;
		case 'monthly':
		default:
			newDate.setMonth(date.getMonth() + (direction === 'next' ? 1 : -1));
			break;
	}

	return newDate;
};

export function usePeriod(initialPeriod: PeriodType = 'monthly') {
	const [periodType, setPeriodType] = useState<PeriodType>(initialPeriod);
	const [currentPeriod, setCurrentPeriod] = useState(new Date());

	const getPeriodDates = useMemo(() => calculatePeriodDates(currentPeriod, periodType), [currentPeriod, periodType]);

	const nextPeriod = () => setCurrentPeriod(prevDate => shiftPeriod(prevDate, periodType, 'next'));
	const previousPeriod = () => setCurrentPeriod(prevDate => shiftPeriod(prevDate, periodType, 'previous'));

	const getPreviousPeriodDates = useMemo(() => {
		const previousPeriodDate = shiftPeriod(currentPeriod, periodType, 'previous');
		return calculatePeriodDates(previousPeriodDate, periodType);
	}, [currentPeriod, periodType]);

	const getNextPeriodDates = useMemo(() => {
		const nextPeriodDate = shiftPeriod(currentPeriod, periodType, 'next');
		return calculatePeriodDates(nextPeriodDate, periodType);
	}, [currentPeriod, periodType]);

	return {
		periodType,
		setPeriodType,
		currentPeriod,
		setCurrentPeriod,
		nextPeriod,
		previousPeriod,
		getPeriodDates,
		getPreviousPeriodDates,
		getNextPeriodDates,
	};
}

export const usePeriodTitle = (periodType: PeriodType, currentPeriod: Date) => {
	const {formatter} = useLocale();
	switch (periodType) {
		case 'weekly': {
			const startOfWeek = new Date(currentPeriod);
			startOfWeek.setDate(currentPeriod.getDate() - currentPeriod.getDay());
			const endOfWeek = new Date(startOfWeek);
			endOfWeek.setDate(startOfWeek.getDate() + 6);
			return `${formatter.date(startOfWeek, {
				day: 'numeric',
				month: 'short',
			})} - ${formatter.date(endOfWeek, {
				day: 'numeric',
				month: 'short',
			})}`;
		}

		case 'yearly':
			return formatter.date(currentPeriod, {year: 'numeric'});

		case 'monthly':
		default:
			return formatter.date(currentPeriod, {
				month: 'long',
				year: 'numeric',
			});
	}
};
