import React, {forwardRef} from 'react';
import {Avatar, AvatarFallback} from '@/components/ui/avatar.tsx';

export type FinanceButtonProps = {
	colorClass: string;
	icon: React.ReactNode;
	label: string;
	amount: number;
};
export const FinanceButton = forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<'button'> & FinanceButtonProps>(
	({colorClass, icon, label, amount, ...props}, ref) =>
		<button ref={ref} {...props}
			className='flex items-center space-x-2 rounded-md border p-2 bg-secondary flex-grow overflow-hidden data-[state=on]:ring ring-primary/50'>
			<Avatar>
				<AvatarFallback className={colorClass}>
					{icon}
				</AvatarFallback>
			</Avatar>
			<div className='flex flex-col flex-grow items-start truncate'>
				<span className='truncate text-zinc-400'>{label}</span>
				<span className={'font-bold text-xl truncate'}>
					{amount.toLocaleString('fr-CH', {
						style: 'currency',
						currency: 'CHF',
					})}
				</span>
			</div>
		</button>,
);
FinanceButton.displayName = 'FinanceButton';
