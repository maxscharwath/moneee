import { TransactionAutocomplete } from "@/components/transaction-autocomplete";
import { CalendarInput } from "@/components/calendar-input";
import { CategorySelect } from "@/components/category-select";
import { Container } from "@/components/container";
import { Header } from "@/components/header";
import { NumericButton } from "@/components/numeric-button";
import {
	RecurrenceSelect,
	type RecurrenceType,
} from "@/components/recurrence-select";
import { Button } from "@/components/ui/button";
import * as TabsGroup from "@/components/ui/tabs-group";
import { useCategories } from "@/hooks/useCategory";
import { getRecurrences } from "@/hooks/useRecurrence";
import { getTransactions } from "@/hooks/useTransaction";
import { useLocale } from "@/i18n";
import {
	cronToRecurrenceType,
	generateCronExpression,
} from "@/lib/recurrentUtils";
import { type Optional, parseNumberFromString } from "@/lib/utils";
import type { Recurrence } from "@/stores/schemas/recurrence";
import type { Transaction } from "@/stores/schemas/transaction";
import type { DialogProps } from "@radix-ui/react-dialog";
import * as Dialog from "@radix-ui/react-dialog";
import { Check, Delete, ScrollTextIcon, XIcon } from "lucide-react";
import React, { useCallback, useEffect, useMemo } from "react";
import type { Category } from "@/stores/schemas/category";

type TransactionModalProps = Readonly<{
	transaction?: Transaction;
	onTransaction: (transaction: Optional<Transaction, "uuid">) => void;
	onRecurrence: (recurrence: Optional<Recurrence, "uuid">) => void;
}>;

function TransactionModalContent({
	transaction,
	onTransaction,
	onRecurrence,
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

	const handlePaste = usePaste(setValue);
	useKeyboard(appendToValue, clearLastDigit, hasDecimal);

	const formatAmount = useMemo(() => {
		const fractionDigits = Math.min(decimalPlaces, 2);
		return formatter.currency(value, {
			minimumFractionDigits: fractionDigits,
			maximumFractionDigits: fractionDigits,
		});
	}, [formatter, value, decimalPlaces]);

	const [date, setDate] = React.useState(
		new Date(transaction?.date ?? Date.now()),
	);
	const [categoryId, setCategoryId] = React.useState(
		transaction?.categoryId ?? "",
	);
	const [recurring, setRecurring] = React.useState<RecurrenceType>(
		transaction?.recurrence
			? cronToRecurrenceType(transaction.recurrence.cron)
			: "none",
	);
	const [note, setNote] = React.useState(transaction?.note ?? "");
	const { result: categories } = useCategories();
	const categoryMap = useMemo(
		() => new Map(categories.map((category) => [category.uuid, category])),
		[categories],
	);
	const [type, setType] = React.useState<"income" | "expense">();

	useEffect(() => {
		setType(
			categories?.find((category) => category.uuid === categoryId)?.type ??
				"expense",
		);
	}, [categories, categoryId]);

	const filteredCategories = useMemo(
		() => categories.filter((category) => category.type === type),
		[categories, type],
	);

	const handleTransaction = () => {
		if (value > 0 && categoryId !== "") {
			if (recurring === "none") {
				onTransaction({
					uuid: transaction?.uuid,
					amount: value,
					categoryId,
					date: date.toISOString(),
					note,
				});
			} else {
				const cronExpression = generateCronExpression(recurring, date);
				onRecurrence({
					uuid: transaction?.recurrence?.uuid,
					amount: value,
					categoryId,
					note,
					startDate: date.toISOString(),
					cron: cronExpression,
				});
			}
		}
	};

	const { result: transactions } = getTransactions();
	const { result: recurrences } = getRecurrences();

	const options = useMemo(
		() =>
			[...transactions, ...recurrences]
				.reduce(
					(uniqueNotes, { categoryId, note }) => {
						if (note && !uniqueNotes.some((item) => item.value === note)) {
							uniqueNotes.push({
								value: note,
								category: categoryMap.get(categoryId),
							});
						}
						return uniqueNotes;
					},
					[] as { value: string; category?: Category }[],
				)
				.sort((a, b) => a.value.localeCompare(b.value)),
		[transactions, recurrences, categoryMap],
	);

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
							setCategoryId("");
							setType(t as "income" | "expense");
						}}
					>
						<TabsGroup.Item value="income">
							{t("transaction.income")}
						</TabsGroup.Item>
						<TabsGroup.Item value="expense">
							{t("transaction.expense")}
						</TabsGroup.Item>
					</TabsGroup.Root>
					<RecurrenceSelect
						value={recurring}
						onValueChange={setRecurring} // No immediate effect; waits for validation in handleTransaction
					/>
				</div>
			</Header>
			<Container className="flex grow flex-col">
				<div className="grid grow grid-cols-[1fr,auto,1fr] items-center gap-4">
					<div />
					<div className="flex flex-col items-center space-y-4">
						<button
							className="truncate text-center text-4xl font-extrabold"
							onClick={handlePaste}
							type="button"
						>
							{formatAmount}
						</button>
						<TransactionAutocomplete
							icon={<ScrollTextIcon />}
							placeholder={t("transaction.add_note")}
							value={{ value: note, category: categoryMap.get(categoryId) }}
							onChange={({ value, category }) => {
								setNote(value);
								if (category) {
									setCategoryId(category.uuid);
									setType(category.type);
								}
							}}
							options={options}
							emptyMessage={t("transaction.no_notes")}
						/>
					</div>
					<div className="flex flex-col items-end">
						{valueString !== "0" && (
							<Button onClick={clearLastDigit} size="icon" variant="ghost">
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
						defaultType={type}
					/>
				</div>
				<div className="grid w-full max-w-lg grid-cols-3 gap-4 place-self-center">
					{["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map(
						(value) => (
							<NumericButton
								key={value}
								value={value}
								hasDecimal={hasDecimal}
								appendToAmount={appendToValue}
							/>
						),
					)}
					<Button disabled={!isValid} size="xl" onClick={handleTransaction}>
						<Check />
					</Button>
				</div>
			</Container>
		</div>
	);
}

export function TransactionModal({
	transaction,
	onTransaction,
	onRecurrence,
	...props
}: TransactionModalProps & DialogProps) {
	return (
		<Dialog.Root {...props}>
			<Dialog.Portal>
				<Dialog.Content className="fixed inset-0 z-50 bg-background/90 backdrop-blur-lg duration-500 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom">
					<TransactionModalContent
						transaction={transaction}
						onTransaction={onTransaction}
						onRecurrence={onRecurrence}
					/>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}

function useNumericInput(initialValue = 0) {
	const [valueString, setValueString] = React.useState(initialValue.toString());
	const hasDecimal = useMemo(() => valueString.includes("."), [valueString]);
	const decimalPlaces = useMemo(() => {
		const parts = valueString.split(".");
		return parts.length > 1 ? parts[1].length : 0;
	}, [valueString]);

	const isValid = useMemo(() => {
		const decimalCount = valueString.match(/\./g)?.length ?? 0;
		return (
			decimalCount <= 1 && !valueString.includes("..") && decimalPlaces <= 2
		);
	}, [valueString, decimalPlaces]);

	const appendToValue = (char: string) => {
		if (
			!(char === "." && hasDecimal) &&
			!(decimalPlaces === 2 && !Number.isNaN(Number(char)))
		) {
			setValueString((prev) =>
				prev === "0" && char !== "." ? char : prev + char,
			);
		}
	};

	const clearLastDigit = () => {
		setValueString((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
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

function usePaste(setValue: (value: number) => void) {
	const handlePaste = useCallback(() => {
		navigator.clipboard
			.readText()
			.then((text) => {
				const num = parseNumberFromString(text);
				if (num !== null) {
					setValue(num);
				}
			})
			.catch((error) => {
				console.error("Failed to read from clipboard:", error);
			});
	}, [setValue]);

	useEffect(() => {
		window.addEventListener("paste", handlePaste);
		return () => {
			window.removeEventListener("paste", handlePaste);
		};
	}, [handlePaste]);

	return handlePaste;
}

const allowedNumbers = new Set([
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"0",
]);
const decimalSymbols = new Set([".", ","]);
function useKeyboard(
	appendToValue: (char: string) => void,
	clearLastDigit: () => void,
	hasDecimal: boolean,
) {
	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.target instanceof HTMLInputElement) {
				return;
			}

			if (allowedNumbers.has(e.key)) {
				appendToValue(e.key);
			} else if (!hasDecimal && decimalSymbols.has(e.key)) {
				appendToValue(".");
			} else if (e.key === "Backspace") {
				clearLastDigit();
			}
		},
		[appendToValue, clearLastDigit, hasDecimal],
	);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);
}
