import type React from 'react';
import {type PropsWithChildren} from 'react';
import {cn} from '@/lib/utils';

export const Container: React.FC<PropsWithChildren<{className?: string}>> = ({
	children,
	className,
}) => (
	<div className={cn('flex-1 space-y-4 overflow-y-auto p-4 overflow-x-hidden', className)}>
		{children}
	</div>
);
