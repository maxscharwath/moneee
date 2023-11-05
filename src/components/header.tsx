import type React from 'react';
import type {PropsWithChildren} from 'react';
import {cn} from '@/lib/utils.ts';

export const Header: React.FC<PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = ({
	children,
	className,
}) => (
	<nav
		className={cn('flex items-center gap-4 bg-background box-content h-16 px-4 portrait:standalone:pt-14', className)}>
		{children}
	</nav>
);

export const HeaderTitle: React.FC<PropsWithChildren> = ({
	children,
}) => (
	<h1 className='text-2xl font-bold'>{children}</h1>
);
