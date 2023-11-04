import React, {forwardRef, type HTMLProps, type PropsWithChildren} from 'react';
import {Avatar, AvatarFallback} from '@/components/ui/avatar.tsx';
import {cn} from '@/lib/utils';

export const Root = React.forwardRef<HTMLDivElement, PropsWithChildren>(({children}, ref) => (
	<div ref={ref} className='flex flex-col space-y-4'>
		{children}
	</div>
));
Root.displayName = 'List.Root';

type GroupProps = {
	heading: string;
};

export const Group = React.forwardRef<HTMLDivElement, PropsWithChildren<GroupProps>>(({heading, children}, ref) => (
	<div ref={ref}>
		<h2 className='mb-2 ml-2 text-xs font-bold uppercase text-muted-foreground'>{heading}</h2>
		<div className='flex flex-col gap-2 rounded-lg bg-muted p-1'>
			{children}
		</div>
	</div>
));
Group.displayName = 'List.Group';

export const List = React.forwardRef<HTMLUListElement, PropsWithChildren<{}>>(({children}, ref) => (
	<ul ref={ref} className='m-0 list-none p-0'>
		{children}
	</ul>
));
List.displayName = 'List';

export const Item = React.forwardRef<HTMLLIElement, HTMLProps<HTMLLIElement>>(({children, ...props}, ref) => (
	<li ref={ref} {...props} className='flex select-none items-center gap-2 rounded-lg p-3 active:bg-muted-foreground/20'>
		{children}
	</li>
));
Item.displayName = 'List.Item';

type ItemIconProps = {
	className?: string;
};

export const ItemIcon = forwardRef<HTMLDivElement, PropsWithChildren<ItemIconProps>>(({children, className}, ref) => (
	<Avatar className='h-8 w-8' ref={ref}>
		<AvatarFallback className={cn('p-1 text-primary', className)}>
			{children}
		</AvatarFallback>
	</Avatar>
));
ItemIcon.displayName = 'List.ItemIcon';
