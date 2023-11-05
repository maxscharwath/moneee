import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select.tsx';
import {LayoutGrid} from 'lucide-react';
import {memo} from 'react';
import {useTranslation} from 'react-i18next';
import {type Category} from '@/stores/schemas/category.ts';

type CategorySelectProps = {
	value: string;
	onValueChange: (value: string) => void;
	categories: Category[];
};

export const CategorySelect = memo(({
	value,
	onValueChange,
	categories,
}: CategorySelectProps) => {
	const {t} = useTranslation();
	return (
		<Select onValueChange={onValueChange} value={value}>
			<SelectTrigger>
				<SelectValue
					placeholder={(
						<div className='inline-flex items-center justify-center truncate'>
							<LayoutGrid className='mr-2 h-4 w-4'/>
							{t('category.select')}
						</div>
					)}
				/>
			</SelectTrigger>
			<SelectContent position='item-aligned'>
				{categories.map(category => (
					<SelectItem key={category.uuid} value={category.uuid}>
						<div className='flex items-center space-x-2'>
							<span>{category.icon}</span>
							<span>{category.name}</span>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
});

CategorySelect.displayName = 'CategorySelect';
