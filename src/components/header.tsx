import type React from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select.tsx';
import {Button} from '@/components/ui/button.tsx';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import {type PeriodType} from '@/hooks/usePeriod.ts';

type HeaderProps = {
	title: string;
	defaultValue?: PeriodType;
	onPeriodChange?: (period: PeriodType) => void;
	onPreviousPeriod?: () => void;
	onNextPeriod?: () => void;
};

export const Header: React.FC<HeaderProps> = ({
	title,
	defaultValue,
	onPeriodChange,
	onPreviousPeriod,
	onNextPeriod,
}) => (
	<nav
		className='sticky top-0 z-10 flex items-center justify-between bg-background p-4 shadow-md portrait:standalone:pt-14'>
		<h1 className='text-2xl font-bold'>{title}</h1>
		<div className='flex items-center space-x-2'>
			<Button size='icon' variant='ghost' onClick={onPreviousPeriod}>
				<ChevronLeft size={24}/>
			</Button>
			<Button size='icon' variant='ghost' onClick={onNextPeriod}>
				<ChevronRight size={24}/>
			</Button>
			<Select
				defaultValue={defaultValue}
				onValueChange={onPeriodChange}
			>
				<SelectTrigger>
					<SelectValue placeholder='Select period'/>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='weekly'>Weekly</SelectItem>
					<SelectItem value='monthly'>Monthly</SelectItem>
					<SelectItem value='yearly'>Yearly</SelectItem>
				</SelectContent>
			</Select>
		</div>
	</nav>
);
