import React, { useCallback, useEffect, useMemo } from 'react';
import { Check, Delete, ScrollText, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as TabsGroup from '@/components/ui/tabs-group';
import { CalendarInput } from '@/components/calendar-input';
import { NumericButton } from '@/components/numeric-button';
import { type Optional, parseNumberFromString } from '@/lib/utils';
import { CategorySelect } from '@/components/category-select';
import { Input } from '@/components/ui/input';
import { useCategories } from '@/stores/db';
import * as Dialog from '@radix-ui/react-dialog';
import { type DialogProps } from '@radix-ui/react-dialog';
import { Header } from '@/components/header';
import { useLocale } from '@/i18n';
import { type Transaction } from '@/stores/schemas/transaction';

type TransactionModalProps = {
    transaction?: Transaction;
    onTransaction: (transaction: Optional<Transaction, 'uuid'>) => void;
};

function TransactionModalContent({
    transaction,
    onTransaction,
}: TransactionModalProps) {
    const { t, formatter } = useLocale();
    const {
        value,
        valueString,
        setValue,
        hasDecimal,
        decimalPlaces,
        isValid,
        appendToValue,
        clearLastDigit,
    } = useNumericInput(transaction?.amount ?? 0);

    const handlePaste = usePaste(value, setValue);
    useKeyboard(valueString, appendToValue, clearLastDigit, hasDecimal);

    const formatAmount = useMemo(() => {
        const fractionDigits = Math.min(decimalPlaces, 2);
        return formatter.currency(value, {
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
        });
    }, [formatter, value, decimalPlaces]);

    const [date, setDate] = React.useState(
        new Date(transaction?.date ?? Date.now())
    );
    const [categoryId, setCategoryId] = React.useState(
        transaction?.categoryId ?? ''
    );
    const [note, setNote] = React.useState(transaction?.note ?? '');
    const { result: categories } = useCategories();
    const [type, setType] = React.useState<'income' | 'expense'>();

    React.useEffect(() => {
        setType(
            categories?.find((category) => category.uuid === categoryId)
                ?.type ?? 'expense'
        );
    }, [categories, transaction]);

    const filteredCategories = useMemo(
        () => categories.filter((category) => category.type === type),
        [categories, type]
    );

    const handleTransaction = () => {
        if (value > 0 && categoryId !== '') {
            onTransaction({
                uuid: transaction?.uuid,
                amount: value,
                categoryId,
                date: date.toISOString(),
                note,
            });
        }
    };

    return (
        <div className="flex h-full flex-col">
            <Header>
                <div className="grid w-full grid-cols-[1fr,auto,1fr] items-center gap-4">
                    <Dialog.Close asChild>
                        <Button variant="ghost" size="icon">
                            <XIcon />
                        </Button>
                    </Dialog.Close>
                    <TabsGroup.Root
                        value={type}
                        onValueChange={(t) => {
                            setCategoryId('');
                            setType(t as 'income' | 'expense');
                        }}
                    >
                        <TabsGroup.Item value="income">
                            {t('transaction.income')}
                        </TabsGroup.Item>
                        <TabsGroup.Item value="expense">
                            {t('transaction.expense')}
                        </TabsGroup.Item>
                    </TabsGroup.Root>
                    <div className="flex justify-end" />
                </div>
            </Header>
            <div className="flex grow flex-col space-y-4 p-4">
                <div className="grid grow grid-cols-[1fr,auto,1fr] items-center gap-4">
                    <div />
                    <div className="flex flex-col items-center space-y-4">
                        <button
                            className="truncate text-center text-4xl font-extrabold"
                            onClick={handlePaste}
                        >
                            {formatAmount}
                        </button>
                        <Input
                            type="text"
                            placeholder={t('transaction.add_note')}
                            icon={<ScrollText />}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col items-end">
                        {valueString !== '0' && (
                            <Button
                                onClick={clearLastDigit}
                                size="icon"
                                variant="ghost"
                            >
                                <Delete />
                            </Button>
                        )}
                    </div>
                </div>
                <div className="flex space-x-2">
                    <CalendarInput date={date} setDate={setDate} />
                    <CategorySelect
                        value={categoryId}
                        onValueChange={setCategoryId}
                        categories={filteredCategories}
                    />
                </div>
                <div className="grid w-full max-w-lg grid-cols-3 gap-4 place-self-center">
                    {[
                        '1',
                        '2',
                        '3',
                        '4',
                        '5',
                        '6',
                        '7',
                        '8',
                        '9',
                        '.',
                        '0',
                    ].map((value) => (
                        <NumericButton
                            key={value}
                            value={value}
                            hasDecimal={hasDecimal}
                            appendToAmount={appendToValue}
                        />
                    ))}
                    <Button
                        disabled={!isValid}
                        size="xl"
                        onClick={handleTransaction}
                    >
                        <Check />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export function TransactionModal({
    transaction,
    onTransaction,
    ...props
}: TransactionModalProps & DialogProps) {
    return (
        <Dialog.Root {...props}>
            <Dialog.Portal>
                <Dialog.Content className="fixed inset-0 z-50 bg-background/90 backdrop-blur-lg duration-500 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom">
                    <TransactionModalContent
                        transaction={transaction}
                        onTransaction={onTransaction}
                    />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

function useNumericInput(initialValue = 0) {
    const [valueString, setValueString] = React.useState(
        initialValue.toString()
    );
    const hasDecimal = useMemo(() => valueString.includes('.'), [valueString]);
    const decimalPlaces = useMemo(() => {
        const parts = valueString.split('.');
        return parts.length > 1 ? parts[1].length : 0;
    }, [valueString]);

    const isValid = useMemo(() => {
        const decimalCount = (valueString.match(/\./g) ?? []).length;
        return (
            decimalCount <= 1 &&
            !valueString.includes('..') &&
            decimalPlaces <= 2
        );
    }, [valueString, decimalPlaces]);

    const appendToValue = (char: string) => {
        if (
            !(char === '.' && hasDecimal) &&
            !(decimalPlaces === 2 && !Number.isNaN(Number(char)))
        ) {
            setValueString((prev) =>
                prev === '0' && char !== '.' ? char : prev + char
            );
        }
    };

    const clearLastDigit = () => {
        setValueString((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
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
        void navigator.clipboard.readText().then((text) => {
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

function useKeyboard(
    valueString: string,
    appendToValue: (char: string) => void,
    clearLastDigit: () => void,
    hasDecimal: boolean
) {
    const allowedNumbers = new Set([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '0',
    ]);
    const decimalSymbols = new Set(['.', ',']);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
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
        },
        [appendToValue, clearLastDigit, hasDecimal]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [valueString]);
}
