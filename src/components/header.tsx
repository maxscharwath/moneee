import type React from 'react';
import type {PropsWithChildren} from 'react';

export const Header: React.FC<PropsWithChildren> = ({
	children,
}) => (
	<nav
		className='flex items-center justify-between bg-background p-4 portrait:standalone:pt-14'>
		{children}
	</nav>
);

export const HeaderTitle: React.FC<PropsWithChildren> = ({
	children,
}) => (
	<h1 className='text-2xl font-bold'>{children}</h1>
);
