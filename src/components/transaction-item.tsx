import {RotateCw} from 'lucide-react';
import React, {useState} from 'react';
import {useLongPress} from '@uidotdev/usehooks';
import {cn} from '@/lib/utils';
import {Avatar, AvatarFallback} from '@/components/ui/avatar.tsx';
import {Currency} from '@/components/currency.tsx';
import {type Transaction} from '@/stores/schemas/transaction.ts';
import {type Category} from '@/stores/schemas/category.ts';
import {useLocale} from '@/i18n.ts';

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
	const [longPressState, setLongPressState] = useState('normal'); // 'normal', 'pending', 'pressed'
	const {formatter} = useLocale();

	const handleLongPress = () => {
		setLongPressState('pressed');
		// OnLongPress?.(transaction);
	};

	const attrs = useLongPress(handleLongPress, {
		onStart: () => setLongPressState('pending'),
		onCancel: () => setLongPressState('normal'),
		threshold: 1000,
	});

	return (
		<>
			{longPressState === 'pressed' && (
				<div className='fixed inset-0 z-10 bg-background/50 backdrop-blur-sm' onClick={() => setLongPressState('normal')}/>
			)}
			<div
				data-state={longPressState}
				className={cn(
					' p-2 relative rounded-lg flex items-center gap-2 duration-200 transition-all',
					longPressState === 'pending' && 'scale-95 duration-500 delay-500',
					longPressState !== 'normal' && 'z-20',
					longPressState === 'pressed' && 'shadow-lg border',
					className,
				)}
				ref={ref}
				{...props}
				{...attrs}
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
		</>
	);
});
TransactionItem.displayName = 'TransactionItem';
