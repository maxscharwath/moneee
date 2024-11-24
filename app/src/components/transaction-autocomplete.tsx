import { Command as CommandPrimitive } from "cmdk";
import {
	type KeyboardEvent,
	type ReactNode,
	useCallback,
	useRef,
	useState,
} from "react";
import {
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "./ui/command";
import { Skeleton } from "./ui/skeleton";

import { cn } from "@/lib/utils";
import type { Category } from "@/stores/schemas/category";
import { Check } from "lucide-react";

export type Option = {
	value: string;
	category?: Category;
};

type AutoCompleteProps = {
	options: Option[];
	emptyMessage: string;
	value?: Option;
	onChange?: (value: Option) => void;
	isLoading?: boolean;
	disabled?: boolean;
	placeholder?: string;
	icon?: ReactNode;
};

export const TransactionAutocomplete = ({
	options,
	placeholder,
	emptyMessage,
	value,
	onChange,
	disabled,
	icon,
	isLoading = false,
}: AutoCompleteProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const [isOpen, setOpen] = useState(false);
	const [selected, setSelected] = useState<Option>(value as Option);
	const [inputValue, setInputValue] = useState<string>(value?.value ?? "");

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			const input = inputRef.current;
			if (!input) {
				return;
			}

			// Keep the options displayed when the user is typing
			if (!isOpen) {
				setOpen(true);
			}

			// This is not a default behaviour of the <input /> field
			if (event.key === "Enter" && input.value !== "") {
				const optionToSelect = options.find(
					(option) => option.value === input.value,
				);
				if (optionToSelect) {
					setSelected(optionToSelect);
					onChange?.(optionToSelect);
				}
			}

			if (event.key === "Escape") {
				input.blur();
			}
		},
		[isOpen, options, onChange],
	);

	const handleBlur = useCallback(() => {
		setOpen(false);
		onChange?.({ value: inputRef.current?.value ?? "" });
	}, [onChange]);

	const handleSelectOption = useCallback(
		(selectedOption: Option) => {
			setInputValue(selectedOption.value);

			setSelected(selectedOption);
			onChange?.(selectedOption);

			// This is a hack to prevent the input from being focused after the user selects an option
			// We can call this hack: "The next tick"
			setTimeout(() => {
				inputRef?.current?.blur();
			}, 0);
		},
		[onChange],
	);

	return (
		<CommandPrimitive onKeyDown={handleKeyDown} loop>
			<div>
				<CommandInput
					ref={inputRef}
					value={inputValue}
					onValueChange={isLoading ? undefined : setInputValue}
					onBlur={handleBlur}
					onFocus={() => setOpen(true)}
					placeholder={placeholder}
					disabled={disabled}
					icon={icon}
					className="text-base"
				/>
			</div>
			<div className="relative mt-1">
				<div
					className={cn(
						"animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full",
						isOpen ? "block" : "hidden",
					)}
				>
					<CommandList className="rounded-md border bg-popover text-popover-foreground shadow-md">
						{isLoading ? (
							<CommandPrimitive.Loading>
								<div className="p-1">
									<Skeleton className="h-8 w-full" />
								</div>
							</CommandPrimitive.Loading>
						) : null}
						{options.length > 0 && !isLoading ? (
							<CommandGroup>
								{options.map((option) => {
									const isSelected = selected?.value === option.value;
									return (
										<CommandItem
											key={option.value}
											value={option.value}
											onMouseDown={(event) => {
												event.preventDefault();
												event.stopPropagation();
											}}
											onSelect={() => handleSelectOption(option)}
											className={cn(
												"flex w-full items-center gap-2",
												!isSelected ? "pl-8" : null,
											)}
										>
											{isSelected ? <Check className="w-4" /> : null}
											<div className="flex items-center space-x-2">
												<span>{option.category?.icon}</span>
												<span>{option.value}</span>
											</div>
										</CommandItem>
									);
								})}
							</CommandGroup>
						) : null}
						{!isLoading ? (
							<CommandPrimitive.Empty className="select-none rounded-sm px-2 py-3 text-center text-sm">
								{emptyMessage}
							</CommandPrimitive.Empty>
						) : null}
					</CommandList>
				</div>
			</div>
		</CommandPrimitive>
	);
};
