import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select.tsx';
import {LayoutGrid} from 'lucide-react';
import {type Category} from '@/stores/models.ts';
import {memo} from 'react';

type CategorySelectProps = {
	value: string;
	onValueChange: (value: string) => void;
	categories: Category[];
};

export const CategorySelect = memo(({
	value,
	onValueChange,
	categories,
}: CategorySelectProps) => (
	<Select onValueChange={onValueChange} value={value}>
		<SelectTrigger>
			<SelectValue
				placeholder={(
					<div className='inline-flex items-center justify-center'>
						<LayoutGrid className='mr-2 h-4 w-4'/>
						Select category
					</div>
				)}
			/>
		</SelectTrigger>
		<SelectContent position='item-aligned'>
			{categories.map(category => (
				<SelectItem key={category.id} value={category.id}>
					<div className='flex items-center space-x-2'>
						<span>{category.icon}</span>
						<span>{category.name}</span>
					</div>
				</SelectItem>
			))}
		</SelectContent>
	</Select>
));

CategorySelect.displayName = 'CategorySelect';
