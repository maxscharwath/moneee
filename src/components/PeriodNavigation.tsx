// PeriodNavigation.tsx
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {Button} from '@/components/ui/button';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {type PeriodType} from '@/hooks/usePeriod';
import type React from 'react';
import {useLocale} from '@/i18n.ts';

type PeriodNavigationProps = {
	defaultValue?: PeriodType;
	onPeriodChange?: (period: PeriodType) => void;
	onPreviousPeriod?: () => void;
	onNextPeriod?: () => void;
};

export const PeriodNavigation: React.FC<PeriodNavigationProps> = ({
	defaultValue,
	onPeriodChange,
	onPreviousPeriod,
	onNextPeriod,
}) => {
	const {t} = useLocale();
	return (
		<div className='flex items-center space-x-2'>
			<Button size='icon' variant='ghost' onClick={onPreviousPeriod}>
				<ChevronLeft size={24}/>
			</Button>
			<Button size='icon' variant='ghost' onClick={onNextPeriod}>
				<ChevronRight size={24}/>
			</Button>
			<Select defaultValue={defaultValue} onValueChange={onPeriodChange}>
				<SelectTrigger>
					<SelectValue placeholder={t('period.placeholder')}/>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='weekly'>{t('period.weekly')}</SelectItem>
					<SelectItem value='monthly'>{t('period.monthly')}</SelectItem>
					<SelectItem value='yearly'>{t('period.yearly')}</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};
