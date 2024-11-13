import type React from "react";
import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export const Header: React.FC<
	PropsWithChildren<React.HTMLAttributes<HTMLElement>>
> = ({ children, className }) => (
	<nav
		className={cn(
			"box-content flex h-16 items-center gap-4 bg-background px-4 pt-safe",
			className,
		)}
	>
		{children}
	</nav>
);

export const HeaderTitle: React.FC<PropsWithChildren> = ({ children }) => (
	<h1 className="text-2xl font-bold">{children}</h1>
);
