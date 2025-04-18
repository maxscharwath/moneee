import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-md font-medium ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline:
					"border border-input bg-background hover:bg-accent hover:text-accent-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost:
					"hover:bg-muted-foreground/20 hover:text-accent-foreground active:bg-muted-foreground/30",
				link: "text-primary underline-offset-4 hover:underline",
				navlink:
					"text-zinc-400 aria-[current=page]:bg-primary-foreground aria-[current=page]:text-primary",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				xl: "h-16 rounded-lg px-8 text-3xl font-medium",
				icon: "h-10 w-10",
			},
			fullWidth: {
				true: "w-full grow",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export type ButtonProps = {
	asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
	VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(
					buttonVariants({
						variant,
						size,
						fullWidth,
						className,
					}),
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
