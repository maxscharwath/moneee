import * as TabsPrimitive from '@radix-ui/react-tabs';
import {motion} from 'framer-motion';
import React from 'react';
import {cn} from '@/lib/utils';
import {cva, type VariantProps} from 'class-variance-authority';

// Define your variants with cva for the Root
const rootVariants = cva(
	'relative flex space-x-2 rounded-full border bg-background p-1',
	{
		variants: {
			size: {
				sm: 'text-sm',
				md: 'text-base',
				lg: 'text-lg',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
);

// Define your variants with cva for the Item
const itemVariants = cva(
	'relative inline-flex h-10 grow cursor-pointer items-center justify-center px-4 py-2 text-base font-medium transition active:scale-95',
	{
		variants: {
			size: {
				sm: 'h-8 px-3',
				md: 'h-10 px-4',
				lg: 'h-12 px-6',
			},
		},
		defaultVariants: {
			size: 'md',
		},
	},
);

type TabsContextType = VariantProps<typeof rootVariants> & {
	uniqueId: string;
};

const TabsContext = React.createContext<TabsContextType>({size: 'md', uniqueId: ''});

function useUUID() {
	return React.useMemo(() => crypto.randomUUID(), []);
}

type RootProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & VariantProps<typeof rootVariants>;

export const Root = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Root>, RootProps>(
	({className, size, children, ...props}, ref) => {
		const uniqueId = useUUID();
		return (
			<TabsPrimitive.Root ref={ref} className={cn(rootVariants({size}), className)} {...props}>
				<TabsContext.Provider value={{size, uniqueId}}>
					<TabsPrimitive.List>{children}</TabsPrimitive.List>
				</TabsContext.Provider>
			</TabsPrimitive.Root>
		);
	},
);
Root.displayName = 'TabsRoot';

type ItemProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & VariantProps<typeof itemVariants>;

export const Item = React.forwardRef<
React.ElementRef<typeof TabsPrimitive.Trigger>,
ItemProps
>(({className, ...props}, ref) => {
	const {size, uniqueId} = React.useContext(TabsContext);

	return (
		<TabsPrimitive.Trigger
			ref={ref}
			className={cn(itemVariants({size}), className)}
			{...props}
		>
			<span className='z-10'>{props.children}</span>
			<TabsPrimitive.Content value={props.value} asChild>
				<motion.div
					layoutId={`tab-indicator-${uniqueId}`}
					className='absolute inset-0 h-full w-full rounded-full bg-accent'
				/>
			</TabsPrimitive.Content>
		</TabsPrimitive.Trigger>
	);
},
);
Item.displayName = 'TabsItem';
