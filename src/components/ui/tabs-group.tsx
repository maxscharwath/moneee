import * as RadioGroup from '@radix-ui/react-radio-group';
import {LayoutGroup, motion} from 'framer-motion';
import React, {useId} from 'react';
import {cn} from '@/lib/utils';
import {cva, type VariantProps} from 'class-variance-authority';
import {Slot} from '@radix-ui/react-slot';

const rootVariants = cva(
	'relative flex gap-x-1 rounded-full border bg-background p-1',
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

const itemVariants = cva(
	'group relative flex h-10 grow cursor-pointer items-center justify-center rounded-full px-4 py-2 text-base font-medium outline-none transition active:scale-95',
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

type TabsContextType = VariantProps<typeof rootVariants>;

const TabsContext = React.createContext<TabsContextType>({size: 'md'});

type RootProps = React.ComponentPropsWithoutRef<typeof RadioGroup.Root> & VariantProps<typeof rootVariants>;

export const Root = React.forwardRef<React.ElementRef<typeof RadioGroup.Root>, RootProps>(
	({className, size, children, ...props}, ref) => {
		const id = useId();
		return (
			<RadioGroup.Root ref={ref} className={cn(rootVariants({size}), className)} {...props}>
				<TabsContext.Provider value={{size}}>
					<LayoutGroup id={id}>
						{children}
					</LayoutGroup>
				</TabsContext.Provider>
			</RadioGroup.Root>
		);
	},
);
Root.displayName = 'TabsRoot';

type ItemProps = React.ComponentPropsWithoutRef<typeof RadioGroup.Item> & VariantProps<typeof itemVariants>;

export const Item = React.forwardRef<
React.ElementRef<typeof RadioGroup.Item>,
ItemProps
>(({className, asChild, ...props}, ref) => {
	const {size} = React.useContext(TabsContext);
	const Comp = asChild ? Slot : 'span';
	return (
		<RadioGroup.Item
			ref={ref}
			className={cn(itemVariants({size}), className)}
			{...props}
		>
			<RadioGroup.RadioGroupIndicator asChild>
				<motion.div
					layoutId='tab-indicator'
					className='absolute inset-0 h-full w-full rounded-full bg-accent ring-offset-background group-focus-visible:outline-none group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2'
				/>
			</RadioGroup.RadioGroupIndicator>
			<Comp className='z-10'>
				{props.children}
			</Comp>
		</RadioGroup.Item>
	);
},
);
Item.displayName = 'TabsItem';
