import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { LayoutGrid, PlusIcon } from 'lucide-react';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type Category } from '@/stores/schemas/category';
import { Button } from '@/components/ui/button';
import { CategoryModal } from '@/components/category-modal';
import { Optional } from '@/lib/utils';
import { addCategory } from '@/hooks/useCategory';

type CategorySelectProps = {
    value: string;
    onValueChange: (value: string) => void;
    categories: Category[];
    defaultType?: 'income' | 'expense';
};

export const CategorySelect = memo(
    ({
        value,
        onValueChange,
        categories,
        defaultType,
    }: CategorySelectProps) => {
        const { t } = useTranslation();
        const [open, setOpen] = useState(false);
        const handleCategory = (category: Optional<Category, 'uuid'>) => {
            void addCategory(category);
            setOpen(false);
        };

        return (
            <Select onValueChange={onValueChange} value={value}>
                <SelectTrigger showChevron={false}>
                    <SelectValue
                        placeholder={
                            <div className="inline-flex items-center justify-center truncate">
                                <LayoutGrid className="mr-2 h-4 w-4" />
                                {t('category.select')}
                            </div>
                        }
                    />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                    <SelectGroup>
                        <SelectLabel asChild>
                            <CategoryModal
                                defaultType={defaultType}
                                open={open}
                                onOpenChange={setOpen}
                                onCategory={handleCategory}
                            >
                                <Button variant="ghost" fullWidth>
                                    <PlusIcon className="mr-2 h-4 w-4" />
                                    {t('category.create')}
                                </Button>
                            </CategoryModal>
                        </SelectLabel>
                        {categories.map((category) => (
                            <SelectItem
                                key={category.uuid}
                                value={category.uuid}
                            >
                                <div className="flex items-center space-x-2">
                                    <span>{category.icon}</span>
                                    <span>{category.name}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        );
    }
);

CategorySelect.displayName = 'CategorySelect';
