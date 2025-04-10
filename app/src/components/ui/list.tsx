import React, {
	forwardRef,
	type HTMLProps,
	type PropsWithChildren,
} from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, getPastelColorFromHash } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { TinyColor } from "@ctrl/tinycolor";

export const Root = React.forwardRef<HTMLDivElement, PropsWithChildren>(
	({ children }, ref) => (
		<div ref={ref} className="flex flex-col space-y-4">
			{children}
		</div>
	),
);
Root.displayName = "List.Root";

type ListProps = {
	heading?: string;
};

export const List = React.forwardRef<
	HTMLUListElement,
	PropsWithChildren<ListProps>
>(({ children, heading }, ref) => (
	<div>
		{heading && (
			<h2 className="mb-2 ml-2 text-xs font-bold uppercase text-muted-foreground">
				{heading}
			</h2>
		)}
		<ul
			ref={ref}
			className="flex flex-col  *:py-1 first:*:pt-0 last:*:pb-0 rounded-lg bg-muted p-1 divide-y divide-muted-foreground/10"
		>
			{children}
		</ul>
	</div>
));
List.displayName = "List";

export const Item = React.forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
	({ children, ...props }, ref) => (
		<li className="flex">
			<div
				ref={ref}
				{...props}
				className="flex flex-1 select-none items-center gap-2 overflow-hidden rounded-lg p-3"
			>
				{children}
			</div>
		</li>
	),
);
Item.displayName = "List.Item";

export type ItemButtonProps = {
	asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
export const ItemButton = React.forwardRef<HTMLButtonElement, ItemButtonProps>(
	({ children, asChild, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<li className="flex">
				<Comp
					ref={ref}
					{...props}
					className="flex flex-1 cursor-pointer select-none items-center gap-2 overflow-hidden rounded-lg p-3 ring-offset-background transition hover:bg-muted-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:bg-muted-foreground/30"
				>
					{children}
				</Comp>
			</li>
		);
	},
);
ItemButton.displayName = "List.ItemButton";

type ItemIconProps = {
	className?: string;
	colorFromValue?: string;
	color?: string;
};

export const ItemIcon = forwardRef<
	HTMLDivElement,
	PropsWithChildren<ItemIconProps>
>(({ children, className, colorFromValue, color }, ref) => {
	const backgroundColor = colorFromValue
		? getPastelColorFromHash(colorFromValue)
		: color;
	const textColor =
		new TinyColor(backgroundColor).getLuminance() > 0.6 ? "#000" : "#fff";
	return (
		<Avatar className="h-8 w-8" ref={ref}>
			<AvatarFallback
				className={cn("p-1", className)}
				style={{ backgroundColor, color: textColor }}
			>
				{children}
			</AvatarFallback>
		</Avatar>
	);
});
ItemIcon.displayName = "List.ItemIcon";
