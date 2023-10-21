import * as ToggleGroup from '@radix-ui/react-toggle-group';
import React from 'react';
import {FinanceButton} from '@/components/FinanceButton.tsx';
import {ArrowDownRight, ArrowUpRight} from 'lucide-react';

type FinanceToggleProps = {
	totalIncome: number;
	totalExpenses: number;
	filter: string;
	setFilter: (value: string) => void;
};

export const FinanceToggle: React.FC<FinanceToggleProps> = ({totalIncome, totalExpenses, filter, setFilter}) => (
	<ToggleGroup.Root
		type='single'
		className='flex space-x-2'
		value={filter}
		onValueChange={f => {
			setFilter(f || 'all');
		}}
	>
		<ToggleGroup.Item value='income' asChild>
			<FinanceButton colorClass='bg-green-500/30 text-green-500' icon={<ArrowUpRight size={24}/>}
				label='Income' amount={totalIncome}/>
		</ToggleGroup.Item>
		<ToggleGroup.Item value='expense' asChild>
			<FinanceButton colorClass='bg-red-500/30 text-red-500' icon={<ArrowDownRight size={24}/>}
				label='Expenses' amount={totalExpenses}/>
		</ToggleGroup.Item>
	</ToggleGroup.Root>
);
