import {useMemo, useState} from 'react';

export type PeriodType = 'weekly' | 'monthly' | 'yearly';

export function usePeriod(initialPeriod: PeriodType = 'monthly') {
	const [periodType, setPeriodType] = useState<PeriodType>(initialPeriod);
	const [currentPeriod, setCurrentPeriod] = useState(new Date()); // Current reference date within the period

	const getPeriodDates = useMemo<[Date, Date]>(() => {
		switch (periodType) {
			case 'weekly': {
				const startOfWeek = new Date(currentPeriod);
				startOfWeek.setDate(currentPeriod.getDate() - currentPeriod.getDay());
				const endOfWeek = new Date(startOfWeek);
				endOfWeek.setDate(startOfWeek.getDate() + 6);
				return [startOfWeek, endOfWeek];
			}

			case 'yearly':
				return [new Date(currentPeriod.getFullYear(), 0, 1), new Date(currentPeriod.getFullYear(), 11, 31)];
			case 'monthly':
			default:
				return [new Date(currentPeriod.getFullYear(), currentPeriod.getMonth(), 1), new Date(currentPeriod.getFullYear(), currentPeriod.getMonth() + 1, 0)];
		}
	}, [currentPeriod, periodType]);

	const nextPeriod = () => {
		const newDate = new Date(currentPeriod);
		switch (periodType) {
			case 'weekly':
				newDate.setDate(currentPeriod.getDate() + 7);
				break;
			case 'yearly':
				newDate.setFullYear(currentPeriod.getFullYear() + 1);
				break;
			case 'monthly':
			default:
				newDate.setMonth(currentPeriod.getMonth() + 1);
				break;
		}

		setCurrentPeriod(newDate);
	};

	const previousPeriod = () => {
		const newDate = new Date(currentPeriod);
		switch (periodType) {
			case 'weekly':
				newDate.setDate(currentPeriod.getDate() - 7);
				break;
			case 'yearly':
				newDate.setFullYear(currentPeriod.getFullYear() - 1);
				break;
			case 'monthly':
			default:
				newDate.setMonth(currentPeriod.getMonth() - 1);
				break;
		}

		setCurrentPeriod(newDate);
	};

	return {
		periodType,
		setPeriodType,
		currentPeriod,
		setCurrentPeriod,
		nextPeriod,
		previousPeriod,
		getPeriodDates,
	};
}

export const usePeriodTitle = (periodType: PeriodType, currentPeriod: Date) => {
	switch (periodType) {
		case 'weekly': {
			const startOfWeek = new Date(currentPeriod);
			startOfWeek.setDate(currentPeriod.getDate() - currentPeriod.getDay());
			const endOfWeek = new Date(startOfWeek);
			endOfWeek.setDate(startOfWeek.getDate() + 6);
			return `${startOfWeek.toLocaleDateString('fr-CH', {day: 'numeric', month: 'short'})} - ${endOfWeek.toLocaleDateString('fr-CH', {day: 'numeric', month: 'short'})}`;
		}

		case 'monthly':
			return currentPeriod.toLocaleDateString('fr-CH', {month: 'long', year: 'numeric'});

		case 'yearly':
			return currentPeriod.toLocaleDateString('fr-CH', {year: 'numeric'});
		default:
			return currentPeriod.toLocaleDateString('fr-CH', {year: 'numeric', month: 'long'});
	}
};
