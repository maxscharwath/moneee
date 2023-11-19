import {RotateCw} from 'lucide-react';
import React from 'react';
import {cn} from '@/lib/utils';
import {Avatar, AvatarFallback} from '@/components/ui/avatar';
import {Currency} from '@/components/currency';
import {type Transaction} from '@/stores/schemas/transaction';
import {type Category} from '@/stores/schemas/category';
import {useLocale} from '@/i18n';

type TransactionItemProps = {
	transaction: Transaction;
	category: Category;
	onLongPress?: (transaction: Transaction) => void;
};

export const TransactionItem = React.forwardRef<HTMLDivElement, TransactionItemProps & React.HTMLAttributes<HTMLDivElement>>(({
	transaction,
	category,
	className,
	...props
}, ref) => {
	const {formatter} = useLocale();
	return (
		<div
			className={cn('p-2 relative rounded-lg flex items-center gap-2', className)}
			ref={ref}
			{...props}
		>
			<Avatar>
				<AvatarFallback style={{backgroundColor: category?.color}} className='text-xl'>
					{category?.icon}
				</AvatarFallback>
				{(
					<div
						className='absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 rounded-xl border bg-background/50 p-1 text-xs backdrop-blur-sm'
					>
						<RotateCw size={12}/>
					</div>
				)}
			</Avatar>
			<div className='flex flex-col'>
				<h3 className='font-bold'>{transaction.note || category?.name}</h3>
				<time className='text-sm text-zinc-400'>
					{formatter.time(new Date(transaction.date), {
						timeStyle: 'short',
					})}
				</time>
			</div>
			<span
				className={cn('font-bold flex-grow text-right', category?.type === 'income' && 'text-green-500')}
			>
				<Currency amount={(transaction.amount * (category?.type === 'expense' ? -1 : 1))}/>
			</span>
		</div>
	);
});
TransactionItem.displayName = 'TransactionItem';
