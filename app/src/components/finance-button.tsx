import type React from "react";
import { forwardRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Currency } from "@/components/currency";

export type FinanceButtonProps = {
	colorClass: string;
	icon: React.ReactNode;
	label: string;
	amount: number;
};
export const FinanceButton = forwardRef<
	HTMLButtonElement,
	React.ComponentPropsWithoutRef<"button"> & FinanceButtonProps
>(({ colorClass, icon, label, amount, ...props }, ref) => (
	<button
		ref={ref}
		{...props}
		className="flex grow items-center gap-2 overflow-hidden rounded-lg border bg-secondary p-2 ring-primary/50 data-[state=on]:ring"
	>
		<Avatar className="h-7 w-7">
			<AvatarFallback className={colorClass}>{icon}</AvatarFallback>
		</Avatar>
		<div className="flex grow flex-col overflow-hidden text-left">
			<span className="truncate text-zinc-400">{label}</span>
			<Currency className="truncate text-lg font-bold" amount={amount} />
		</div>
	</button>
));
FinanceButton.displayName = "FinanceButton";
