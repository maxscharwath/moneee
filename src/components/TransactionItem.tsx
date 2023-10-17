import {cn} from '@/lib/utils';
import {RotateCw} from 'lucide-react';
import {Avatar, AvatarFallback} from '@/components/ui/avatar.tsx';
import React from 'react';
import {type Category, type Transaction} from '@/stores/models.ts';

type TransactionItemProps = {
	transaction: Transaction;
	category: Category;
};

export const TransactionItem: React.FC<TransactionItemProps> = ({transaction, category}) => (
	<li className='flex items-center space-x-2 rounded-md border p-2'>
		<Avatar>
			<AvatarFallback style={{backgroundColor: category?.color}} className='text-xl'>
				{category?.icon}
			</AvatarFallback>
			{transaction.recurrence && (
				<div
					className='absolute bottom-0 right-0 text-xs rounded-xl p-1 transform translate-x-1/4 translate-y-1/4 backdrop-blur-sm border bg-background/50'>
					<RotateCw size={12}/>
				</div>
			)}
		</Avatar>
		<div className='flex flex-col'>
			<h3 className='font-bold'>{transaction.name}</h3>
			<time className='text-sm text-zinc-400'>
				{transaction.date}
			</time>
		</div>
		<span
			className={cn('font-bold flex-grow text-right', category?.type === 'income' && 'text-green-500')}
		>
			{(transaction.amount * (category?.type === 'expense' ? -1 : 1)).toLocaleString('fr-CH', {
				style: 'currency',
				currency: 'CHF',
				signDisplay: 'always',
			})}
		</span>
	</li>
);
