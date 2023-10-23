import React, { useMemo } from 'react'
import {Button} from '@/components/ui/button.tsx';
import * as TabsGroup from '@/components/ui/tabs-group.tsx';
import { Calendar, Check, Delete, LayoutGrid } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx'
import { useCategoryService } from '@/stores/categoryService.tsx'

const NumericButton = ({value, hasDecimal, appendToAmount}: {
	value: string;
	hasDecimal: boolean;
	appendToAmount: (value: string) => void;
}) => (
	<Button
		size='xl'
		key={value}
		onClick={() => {
			appendToAmount(value);
		}}
		disabled={value === '.' && hasDecimal}
	>
		{value}
	</Button>
);

const parseNumberFromString = (str: string): number | null => {
	const normalizedString = str
		.replace(/[^0-9.,']/g, '')
		.replace(/'/g, '')
		.replace(',', '.');
	const matched = /(\d+(\.\d)?)/.exec(normalizedString);
	return matched ? parseFloat(matched[0]) : null;
};

export const AddTransactionModal = () => {
	const [amount, setAmount] = React.useState('0');
	const {categories} = useCategoryService();
	const hasDecimal = useMemo(() => amount.includes('.'), [amount]);
	const decimalPlaces = useMemo(() => {
		const parts = amount.split('.');
		return parts.length > 1 ? parts[1].length : 0;
	}, [amount]);

	const isValidAmount = () => {
		const decimalCount = (amount.match(/\./g) ?? []).length;
		return decimalCount <= 1 && !amount.includes('..') && decimalPlaces <= 2;
	};

	const appendToAmount = (value: string) => {
		if (value === '.' && hasDecimal) {
			return;
		}

		if (decimalPlaces === 2 && !isNaN(Number(value))) {
			return;
		}

		setAmount(prev => prev === '0' && value !== '.' ? value : prev + value);
	};

	const clearLastDigit = () => {
		setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
	};

	const handlePaste = async () => {
		const text = await navigator.clipboard.readText();
		const number = parseNumberFromString(text);
		if (number !== null) {
			setAmount(number.toString());
		}
	}

	const formatAmount = useMemo(() => {
		const fractionDigits = hasDecimal ? 2 : 0;
		return Number(amount).toLocaleString('fr-CH', {
			style: 'currency',
			currency: 'CHF',
			minimumFractionDigits: fractionDigits,
			maximumFractionDigits: fractionDigits,
		});
	}, [amount, hasDecimal]);

	const [value, setValue] = React.useState('expense');

	return (
		<div className='flex flex-col h-[100svh] p-4 space-y-4'>
			<nav className='sticky top-0 z-10 flex items-center justify-center p-4 bg-background shadow-md portrait:standalone:pt-14'>
				<TabsGroup.Root
					value={value}
					onValueChange={value => {
						if (value) {
							setValue(value);
						}
					}}
				>
					<TabsGroup.Item value='income'>
						Income
					</TabsGroup.Item>
					<TabsGroup.Item value='expense'>
						Expense
					</TabsGroup.Item>
				</TabsGroup.Root>
			</nav>
			<div className='flex-grow grid grid-cols-[1fr,auto,1fr] gap-4 items-center'>
				<div/>
				<span className='text-center text-4xl font-extrabold truncate' onClick={handlePaste}>
					{formatAmount}
				</span>
				<div className='flex flex-col items-end'>
					{amount !== '0' && (
						<Button onClick={clearLastDigit} size='icon' variant='ghost'>
							<Delete />
						</Button>
					)}
				</div>
			</div>

			<div className='flex space-x-2'>
				<Button variant='outline' className='flex-grow'>
					<Calendar className='h-4 w-4 mr-2' />
					{new Date().toLocaleDateString('fr-CH', {
						dateStyle: 'medium',
					})}
				</Button>
				<Select>
					<SelectTrigger>
						<SelectValue
							placeholder={(<div className='inline-flex items-center justify-center'><LayoutGrid className='h-4 w-4 mr-2' /> Select category</div>)}
						/>
					</SelectTrigger>
					<SelectContent position='item-aligned'>
						{categories.map(category => (
							<SelectItem key={category.id} value={category.id}>
								<div className='flex items-center space-x-2'>
								<span>{category.icon}</span>
								<span>{category.name}</span>
								</div>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className='grid grid-cols-3 gap-4 max-w-lg w-full place-self-center'>
				{['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map(value => (
					<NumericButton key={value} value={value} hasDecimal={hasDecimal} appendToAmount={appendToAmount} />
				))}
				<Button disabled={!isValidAmount()} size='xl'>
					<Check />
				</Button>
			</div>
		</div>
	);
};
