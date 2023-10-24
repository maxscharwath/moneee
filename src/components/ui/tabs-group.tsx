import * as TabsPrimitive from '@radix-ui/react-tabs';
import {motion} from 'framer-motion';
import React from 'react';
import {cn} from '@/lib/utils';

export const Root = React.forwardRef<
React.ElementRef<typeof TabsPrimitive.Root>,
React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({
	className,
	children,
	...props
}, ref) => (
	<TabsPrimitive.Root
		ref={ref}
		className={cn(
			'relative flex space-x-2 border rounded-full p-1',
			className,
		)}
		{...props}
	>
		<TabsPrimitive.List>
			{children}
		</TabsPrimitive.List>
	</TabsPrimitive.Root>
));
Root.displayName = TabsPrimitive.Root.displayName;

export const Item = React.forwardRef<
React.ElementRef<typeof TabsPrimitive.Trigger>,
React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({
	className,
	...props
}, ref) => (
	<TabsPrimitive.Trigger
		ref={ref}
		className={cn(
			'active:scale-95 transition pointer h-10 px-4 py-2 inline-flex items-center justify-center text-md font-medium flex-grow relative',
			className,
		)}
		{...props}
	>
		<span className={cn('z-10', className)} {...props} />
		<TabsPrimitive.Content value={props.value} asChild>
			<motion.div
				layoutId='underline'
				className='absolute inset-0 h-full w-full rounded-full bg-accent'
			/>
		</TabsPrimitive.Content>
	</TabsPrimitive.Trigger>
));
Item.displayName = TabsPrimitive.Trigger.displayName;
