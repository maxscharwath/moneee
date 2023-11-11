import {RotateCw} from 'lucide-react';
import type React from 'react';
import {cn} from '@/lib/utils';
import {Avatar, AvatarFallback} from '@/components/ui/avatar.tsx';
import {Currency} from '@/components/currency.tsx';
import {type Transaction} from '@/stores/schemas/transaction.ts';
import {type Category} from '@/stores/schemas/category.ts';

type TransactionItemProps = {
	transaction: Transaction;
	category: Category;
};

export const TransactionItem: React.FC<TransactionItemProps> = ({
	transaction,
	category,
}) => (
	<div className='flex items-center space-x-2'>
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
			<h3 className='font-bold'>{transaction.note}</h3>
			<time className='text-sm text-zinc-400'>
				{new Date(transaction.date).toLocaleString('fr-CH', {
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
