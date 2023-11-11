import type React from 'react';
import type {PropsWithChildren} from 'react';
import {cn} from '@/lib/utils.ts';

export const Footer: React.FC<PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = ({
	children,
	className,
}) => (
	<footer
		className={cn('flex items-center gap-4 bg-background box-content h-16 px-4 pb-safe', className)}>
		{children}
	</footer>
);
