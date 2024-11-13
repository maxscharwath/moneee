import type React from "react";

import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";

const variant = {
	default: "bg-blue-500",
	green: "bg-green-500",
	red: "bg-red-500",
	primary: "bg-primary",
};

const indicatorContainerVariants = cva("pointer-events-none relative", {
	variants: {
		position: {
			default: "",
			"top-right": "absolute -translate-y-1/2 translate-x-1/2 right-1 top-1",
			"top-left": "absolute -translate-y-1/2 -translate-x-1/2 left-1 top-1",
			"bottom-right":
				"absolute translate-y-1/2 translate-x-1/2 right-1 bottom-1",
			"bottom-left":
				"absolute translate-y-1/2 -translate-x-1/2 left-1 bottom-1",
		},
	},
	defaultVariants: {
		position: "default",
	},
});

const indicatorVariants = cva(
	"rounded-full ring-1 ring-primary-foreground relative z-10",
	{
		variants: {
			variant,
			size: {
				default: "w-3 h-3",
				sm: "w-2.5 h-2.5",
				lg: "w-4 h-4",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

const indicatorPingVariants = cva(
	"animate-ping absolute inset-0 rounded-full z-0",
	{
		variants: {
			variant,
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface IndicatorProps
	extends React.HTMLAttributes<HTMLSpanElement>,
		VariantProps<typeof indicatorContainerVariants>,
		VariantProps<typeof indicatorVariants>,
		VariantProps<typeof indicatorPingVariants> {
	noPing?: boolean;
}

export const Indicator = ({
	className,
	variant,
	position,
	size,
	noPing,
	...props
}: IndicatorProps) => {
	return (
		<div className={cn(indicatorContainerVariants({ position }), className)}>
			{!noPing && <div className={cn(indicatorPingVariants({ variant }))} />}
			<div className={cn(indicatorVariants({ variant, size }))} {...props} />
		</div>
	);
};
