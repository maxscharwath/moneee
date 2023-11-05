import React, {useCallback, useEffect, useMemo} from 'react';
import {Check, Delete, ScrollText, XIcon} from 'lucide-react';
import {Button} from '@/components/ui/button.tsx';
import * as TabsGroup from '@/components/ui/tabs-group.tsx';
import {CalendarInput} from '@/components/calendar-input.tsx';
import {NumericButton} from '@/components/numeric-button.tsx';
import {parseNumberFromString} from '@/lib/utils.ts';
import {CategorySelect} from '@/components/category-select.tsx';
import {useTranslation} from 'react-i18next';
import {Input} from '@/components/ui/input.tsx';
import {getCategoriesByType, useSettings} from '@/stores/db.ts';
import * as Dialog from '@radix-ui/react-dialog';
import {type DialogProps} from '@radix-ui/react-dialog';
import {Header} from '@/components/header.tsx';

type TransactionModalProps = {
	onTransaction: (amount: number, date: Date, categoryId: string, note: string) => void;
} & DialogProps;

export default function TransactionModal({onTransaction, ...props}: TransactionModalProps) {
	const {
		value,
		valueString,
		setValue,
		hasDecimal,
		decimalPlaces,
		isValid,
		appendToValue,
		clearLastDigit,
	} = useNumericInput();
	const handlePaste = usePaste(value, setValue);
	useKeyboard(valueString, appendToValue, clearLastDigit, hasDecimal);

	const [settings] = useSettings();
	const currency = settings?.currency ?? 'USD';

	const formatAmount = useMemo(() => {
		const fractionDigits = Math.min(decimalPlaces, 2);
		return value
			.toLocaleString('fr-CH', {
				style: 'currency',
				currency,
				minimumFractionDigits: fractionDigits,
				maximumFractionDigits: fractionDigits,
			});
	}, [currency, value, decimalPlaces]);

	const [type, setType] = React.useState<'income' | 'expense'>('expense');
	const [date, setDate] = React.useState(new Date());
	const [categoryId, setCategoryId] = React.useState('');
	const [note, setNote] = React.useState('');
	const {result: categories} = getCategoriesByType(type);

	const handleTransaction = () => {
		if (value > 0 && categoryId !== '') {
			onTransaction(value, date, categoryId, note);
		}
	};

	const {t} = useTranslation();

	return (
		<Dialog.Root {...props}>
			<Dialog.Content
				className='fixed inset-0 z-50 bg-background/90 backdrop-blur-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom-[48%] data-[state=open]:slide-in-from-bottom-[48%]'>
				<div className='flex h-full flex-col'>
					<Header>
						<div className='grid w-full grid-cols-[1fr,auto,1fr] items-center gap-4'>
							<Dialog.Close asChild>
								<Button variant='ghost' size='icon'>
									<XIcon/>
								</Button>
							</Dialog.Close>
							<TabsGroup.Root
								value={type}
								onValueChange={t => {
									setCategoryId('');
									setType(t as 'income' | 'expense');
								}}
							>
								<TabsGroup.Item value='income'>
									{t('transaction.income')}
								</TabsGroup.Item>
								<TabsGroup.Item value='expense'>
									{t('transaction.expense')}
								</TabsGroup.Item>
							</TabsGroup.Root>
							<div className='flex justify-end'/>
						</div>
					</Header>
					<div className='flex grow flex-col space-y-4 p-4'>
						<div className='grid grow grid-cols-[1fr,auto,1fr] items-center gap-4'>
							<div/>
							<div className='flex flex-col items-center space-y-4'>
								<button className='truncate text-center text-4xl font-extrabold' onClick={handlePaste}>
									{formatAmount}
								</button>
								<Input
									type='text'
									placeholder={t('transaction.add_note')}
									icon={<ScrollText/>}
									value={note}
									onChange={e => setNote(e.target.value)}
								/>
							</div>
							<div className='flex flex-col items-end'>
								{valueString !== '0' && (
									<Button onClick={clearLastDigit} size='icon' variant='ghost'>
										<Delete/>
									</Button>
								)}
							</div>
						</div>
						<div className='flex space-x-2'>
							<CalendarInput date={date} setDate={setDate}/>
							<CategorySelect value={categoryId} onValueChange={setCategoryId} categories={categories}/>
						</div>
						<div className='grid w-full max-w-lg grid-cols-3 gap-4 place-self-center'>
							{['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map(value => (
								<NumericButton
									key={value}
									value={value}
									hasDecimal={hasDecimal}
									appendToAmount={appendToValue}
								/>
							))}
							<Button disabled={!isValid} size='xl' onClick={handleTransaction}>
								<Check/>
							</Button>
						</div>
					</div>
				</div>
			</Dialog.Content>
		</Dialog.Root>
	);
}

function useNumericInput(initialValue = 0) {
	const [valueString, setValueString] = React.useState(initialValue.toString());
	const hasDecimal = useMemo(() => valueString.includes('.'), [valueString]);
	const decimalPlaces = useMemo(() => {
		const parts = valueString.split('.');
		return parts.length > 1 ? parts[1].length : 0;
	}, [valueString]);

	const isValid = useMemo(() => {
		const decimalCount = (valueString.match(/\./g) ?? []).length;
		return decimalCount <= 1 && !valueString.includes('..') && decimalPlaces <= 2;
	}, [valueString, decimalPlaces]);

	const appendToValue = (char: string) => {
		if (!(char === '.' && hasDecimal) && !(decimalPlaces === 2 && !Number.isNaN(Number(char)))) {
			setValueString(prev => (prev === '0' && char !== '.' ? char : prev + char));
		}
	};

	const clearLastDigit = () => {
		setValueString(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
	};

	const value = useMemo(() => Number(valueString), [valueString]);
	const setValue = (value: number) => setValueString(value.toString());

	return {
		valueString,
		value,
		setValue,
		hasDecimal,
		decimalPlaces,
		isValid,
		appendToValue,
		clearLastDigit,
	};
}

function usePaste(value: number, setValue: (value: number) => void) {
	const handlePaste = () => {
		void navigator.clipboard.readText()
			.then(text => {
				const num = parseNumberFromString(text);
				if (num !== null) {
					setValue(num);
				}
			});
	};

	useEffect(() => {
		window.addEventListener('paste', handlePaste);

		return () => {
			window.removeEventListener('paste', handlePaste);
		};
	}, [value]);

	return handlePaste;
}

function useKeyboard(valueString: string, appendToValue: (char: string) => void, clearLastDigit: () => void, hasDecimal: boolean) {
	const allowedNumbers = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
	const decimalSymbols = new Set(['.', ',']);

	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.target instanceof HTMLInputElement) {
			return;
		}

		if (allowedNumbers.has(e.key)) {
			appendToValue(e.key);
		} else if (!hasDecimal && decimalSymbols.has(e.key)) {
			appendToValue('.');
		} else if (e.key === 'Backspace') {
			clearLastDigit();
		}
	}, [appendToValue, clearLastDigit, hasDecimal]);

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [valueString]);
}
