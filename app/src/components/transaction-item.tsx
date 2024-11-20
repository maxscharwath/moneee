import { Currency } from "@/components/currency";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocale } from "@/i18n";
import { cn } from "@/lib/utils";
import type { Category } from "@/stores/schemas/category";
import type { Transaction } from "@/stores/schemas/transaction";
import {
	CircleSlash,
	LoaderCircleIcon,
	LoaderPinwheelIcon,
	OctagonAlertIcon,
	RotateCw,
	SlashIcon,
} from "lucide-react";
import React from "react";

type TransactionItemProps = {
	transaction: Transaction;
	category?: Category;
	onLongPress?: (transaction: Transaction) => void;
};

export const TransactionItem = React.forwardRef<
	HTMLDivElement,
	TransactionItemProps & React.HTMLAttributes<HTMLDivElement>
>(({ transaction, category, className, ...props }, ref) => {
	const { formatter } = useLocale();
	return (
		<div
			className={cn(
				"relative flex items-center gap-2 rounded-lg p-2",
				className,
			)}
			ref={ref}
			{...props}
		>
			<Avatar>
				<AvatarFallback
					style={{ backgroundColor: category?.color }}
					className="text-xl"
				>
					{category?.icon ?? <CircleSlash />}
				</AvatarFallback>
				{transaction?.recurrence && (
					<div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 rounded-xl border bg-background/50 p-1 text-xs backdrop-blur-sm">
						<RotateCw size={12} />
					</div>
				)}
			</Avatar>
			<div className="flex flex-col">
				<h3 className="font-bold">{transaction.note || category?.name}</h3>
				<time className="text-sm text-zinc-400">
					{formatter.time(new Date(transaction.date), {
						timeStyle: "short",
					})}
				</time>
			</div>
			<span
				className={cn(
					"flex-grow text-right font-bold",
					category?.type === "income" && "text-green-500",
				)}
			>
				<Currency
					amount={transaction.amount * (category?.type === "expense" ? -1 : 1)}
				/>
			</span>
		</div>
	);
});
TransactionItem.displayName = "TransactionItem";
