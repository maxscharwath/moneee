import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";
import { forwardRef } from "react";

export const Container = forwardRef<
	HTMLDivElement,
	PropsWithChildren<{ className?: string }>
>(({ children, className }, ref) => (
	<div
		ref={ref}
		className={cn(
			"flex flex-col flex-1 space-y-4 overflow-y-auto overflow-x-hidden p-4",
			className,
		)}
	>
		{children}
	</div>
));

Container.displayName = "Container";
