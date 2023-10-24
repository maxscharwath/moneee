import React, {useEffect, useMemo} from 'react';
import {CalendarIcon, Check, Delete, LayoutGrid} from 'lucide-react';
import {Button} from '@/components/ui/button.tsx';
import * as TabsGroup from '@/components/ui/tabs-group.tsx';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select.tsx';
import {useCategoryService} from '@/stores/categoryService.tsx';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover.tsx';
import {Calendar} from '@/components/ui/calendar.tsx';

function NumericButton({
	value,
	hasDecimal,
	appendToAmount,
}: {
	value: string;
	hasDecimal: boolean;
	appendToAmount: (value: string) => void;
}) {
	return (
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
}

const parseNumberFromString = (str: string): number | null => {
	const normalizedString = str
		.replace(/[^0-9.,']/g, '')
		.replace(/'/g, '')
		.replace(',', '.');
	const matched = /(\d+(\.\d)?)/.exec(normalizedString);
	return matched ? parseFloat(matched[0]) : null;
};

export default function AddTransactionModal() {
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

		if (decimalPlaces === 2 && !Number.isNaN(Number(value))) {
			return;
		}

		setAmount(prev => (prev === '0' && value !== '.' ? value : prev + value));
	};

	const clearLastDigit = (): void => {
		setAmount(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
	};

	const handlePaste = async () => {
		const text = await navigator.clipboard.readText();
		const number = parseNumberFromString(text);
		if (number !== null) {
			setAmount(number.toString());
		}
	};

	const formatAmount = useMemo(() => {
		const fractionDigits = hasDecimal ? 2 : 0;
		return Number(amount)
			.toLocaleString('fr-CH', {
				style: 'currency',
				currency: 'CHF',
				minimumFractionDigits: fractionDigits,
				maximumFractionDigits: fractionDigits,
			});
	}, [amount, hasDecimal]);

	const allowedNumbers = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
	const decimalSymbols = new Set(['.', ',']);

	const handleKeyDown = (e: KeyboardEvent) => {
		if (allowedNumbers.has(e.key)) {
			appendToAmount(e.key);
		} else if (!hasDecimal && decimalSymbols.has(e.key)) {
			appendToAmount('.');
		} else if (e.key === 'Backspace') {
			clearLastDigit();
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('paste', handlePaste);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('paste', handlePaste);
		};
	}, [amount, hasDecimal]);

	const [type, setType] = React.useState('expense');
	const [date, setDate] = React.useState(new Date());
	return (
		<div className='flex h-[100svh] flex-col space-y-4 p-4'>
			<nav
				className='sticky top-0 z-10 flex items-center justify-center bg-background p-4 shadow-md portrait:standalone:pt-14'>
				<TabsGroup.Root
					value={type}
					onValueChange={value => {
						if (value) {
							setType(value);
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
			<div className='grid grow grid-cols-[1fr,auto,1fr] items-center gap-4'>
				<div/>
				<button className='truncate text-center text-4xl font-extrabold' onClick={handlePaste}>
					{formatAmount}
				</button>
				<div className='flex flex-col items-end'>
					{amount !== '0' && (
						<Button onClick={clearLastDigit} size='icon' variant='ghost'>
							<Delete/>
						</Button>
					)}
				</div>
			</div>

			<div className='flex space-x-2'>
				<Popover>
					<PopoverTrigger asChild>
						<Button variant='outline' className='grow overflow-hidden'>
							<CalendarIcon className='mr-2 h-4 w-4'/>
							<span className='truncate'>
								{date.toLocaleDateString('fr-CH', {
									dateStyle: 'medium',
								})}
							</span>
						</Button>
					</PopoverTrigger>
					<PopoverContent align='start'>
						<Calendar
							mode='single'
							selected={date}
							onSelect={date => date && setDate(date)}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
				<Select>
					<SelectTrigger>
						<SelectValue
							placeholder={(
								<div className='inline-flex items-center justify-center'>
									<LayoutGrid className='mr-2 h-4 w-4'/>
									{' '}
                  Select category
								</div>
							)}
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
			<div className='grid w-full max-w-lg grid-cols-3 gap-4 place-self-center'>
				{['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map(value => (
					<NumericButton
						key={value}
						value={value}
						hasDecimal={hasDecimal}
						appendToAmount={appendToAmount}
					/>
				))}
				<Button disabled={!isValidAmount()} size='xl'>
					<Check/>
				</Button>
			</div>
		</div>
	);
}
