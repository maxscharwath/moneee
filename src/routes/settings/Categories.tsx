import { Header, HeaderTitle } from '@/components/header';
import { useTranslation } from 'react-i18next';
import * as List from '@/components/ui/list';
import { ChevronLeft, PlusIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { addCategory, getCategoriesByType, removeCategory } from '@/stores/db';
import { Container } from '@/components/container';
import * as TabsGroup from '@/components/ui/tabs-group';
import React from 'react';
import { CategoryModal } from '@/components/category-modal';
import { Category } from '@/stores/schemas/category';
import { Optional } from '@/lib/utils';
import { Spacing } from '@/components/spacing';

export function Component() {
    const { t } = useTranslation();
    const [type, setType] = React.useState<'income' | 'expense'>('expense');
    const { result: categories } = getCategoriesByType(type);
    const [category, setCategory] = React.useState<
        Partial<Category> | undefined
    >();
    const handleCategory = (category: Optional<Category, 'uuid'>) => {
        void addCategory(category);
        setCategory(undefined);
    };

    const handleDeleteCategory = (uuid: string) => {
        console.log('delete category', uuid);
        void removeCategory(uuid);
        setCategory(undefined);
    };

    const suggestedCategories = React.useMemo(() => {
        return (
            type === 'expense' ? expenseCategories : incomeCategories
        ).filter(
            (category) => !categories?.find((c) => c.uuid === category.uuid)
        );
    }, [type, categories]);

    return (
        <>
            <Header>
                <Button variant="ghost" size="icon" asChild>
                    <NavLink
                        to="/settings"
                        className="flex items-center gap-2"
                        state={{ direction: 'left' }}
                    >
                        <ChevronLeft />
                    </NavLink>
                </Button>
                <HeaderTitle>{t('settings.root.categories')}</HeaderTitle>
            </Header>
            <Container>
                <div className="grid w-full grid-cols-[1fr,auto,1fr] items-center gap-4">
                    <div />
                    <TabsGroup.Root
                        value={type}
                        onValueChange={(t) => {
                            setType(t as 'income' | 'expense');
                        }}
                    >
                        <TabsGroup.Item value="income">
                            {t('transaction.income')}
                        </TabsGroup.Item>
                        <TabsGroup.Item value="expense">
                            {t('transaction.expense')}
                        </TabsGroup.Item>
                    </TabsGroup.Root>
                    <div className="flex justify-end">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setCategory({ type })}
                        >
                            <PlusIcon />
                        </Button>
                    </div>
                </div>
                <List.Root>
                    <List.List heading={t('settings.root.categories')}>
                        {categories?.map((category) => (
                            <List.ItemButton
                                key={category.uuid}
                                onClick={() => setCategory(category)}
                            >
                                <List.ItemIcon
                                    style={{ backgroundColor: category.color }}
                                >
                                    {category.icon}
                                </List.ItemIcon>
                                <span className="truncate">
                                    {category.name}
                                </span>
                            </List.ItemButton>
                        ))}
                    </List.List>

                    {suggestedCategories.length > 0 && (
                        <List.List heading={t('settings.category.suggested')}>
                            {suggestedCategories.map((category) => (
                                <List.Item key={category.uuid}>
                                    <List.ItemIcon
                                        style={{
                                            backgroundColor: category.color,
                                        }}
                                    >
                                        {category.icon}
                                    </List.ItemIcon>
                                    <span className="truncate">
                                        {category.name}
                                    </span>
                                    <Spacing />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => addCategory(category)}
                                    >
                                        <PlusIcon />
                                    </Button>
                                </List.Item>
                            ))}
                        </List.List>
                    )}
                </List.Root>
            </Container>
            <CategoryModal
                category={category}
                open={!!category}
                onOpenChange={(open) => !open && setCategory(undefined)}
                onCategory={handleCategory}
                onDelete={handleDeleteCategory}
                key={category?.uuid}
            />
        </>
    );
}

Component.displayName = 'Settings.Categories';

const expenseCategories = [
    {
        uuid: '9a8b7c6d-5e4f-3a2b-1c0d-e9f8g7h6i5j4',
        name: 'Healthcare',
        color: '#F48FB1',
        icon: '🩺',
        type: 'expense',
    },
    {
        uuid: '1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
        name: 'Utilities',
        color: '#80DEEA',
        icon: '💡',
        type: 'expense',
    },
    {
        uuid: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
        name: 'Clothing',
        color: '#E57373',
        icon: '👚',
        type: 'expense',
    },
    {
        uuid: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
        name: 'Education',
        color: '#64B5F6',
        icon: '🎓',
        type: 'expense',
    },
    {
        uuid: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
        name: 'Groceries',
        color: '#81C784',
        icon: '🛒',
        type: 'expense',
    },
    {
        uuid: '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
        name: 'Home Improvement',
        color: '#FFD54F',
        icon: '🛠️',
        type: 'expense',
    },
    {
        uuid: '6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u',
        name: 'Travel',
        color: '#4DB6AC',
        icon: '✈️',
        type: 'expense',
    },
    {
        uuid: '7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v',
        name: 'Dining Out',
        color: '#FF7043',
        icon: '🍽️',
        type: 'expense',
    },
    {
        uuid: '8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w',
        name: 'Pets',
        color: '#A1887F',
        icon: '🐾',
        type: 'expense',
    },
    {
        uuid: '9i0j1k2l-3m4n-5o6p-7q8r-9s0t1u2v3w4x',
        name: 'Beauty & Wellness',
        color: '#F06292',
        icon: '💅',
        type: 'expense',
    },
] satisfies Category[];

const incomeCategories = [
    {
        uuid: '6p5o4n3m-2l1k-0j9i-8h7g-6f5e4d3c2b1a',
        name: 'Freelancing',
        color: '#81C784',
        icon: '💻',
        type: 'income',
    },
    {
        uuid: '5d4c3b2a-1a2b-3c4d-5e6f-7g8h9i0j1k2l',
        name: 'Rental Income',
        color: '#FFB74D',
        icon: '🏠',
        type: 'income',
    },
    {
        uuid: '4c3b2a1b-2c3d-4e5f-6g7h-8i9j0k1l2m3n',
        name: 'Dividends',
        color: '#BA68C8',
        icon: '💹',
        type: 'income',
    },
    {
        uuid: '3b2a1b2c-3d4e-5f6g-7h8i-9j0k1l2m3n4o',
        name: 'Consulting',
        color: '#90CAF9',
        icon: '🧑‍💼',
        type: 'income',
    },
    {
        uuid: '2a1b2c3d-4e5f-6g7h-8i9j-0k1l2m3n4o5p',
        name: 'Book Royalties',
        color: '#FFCCBC',
        icon: '📚',
        type: 'income',
    },
    {
        uuid: '1b2c3d4e-5f6g-7h8i-9j0k-1l2m3n4o5p6q',
        name: 'Online Courses',
        color: '#A5D6A7',
        icon: '💻',
        type: 'income',
    },
    {
        uuid: '0c1b2d3e-4f5g-6h7i-8j9k-0l1m2n3o4p5q',
        name: 'Stock Trading',
        color: '#80CBC4',
        icon: '📊',
        type: 'income',
    },
    {
        uuid: '9a0b1c2d-3e4f-5g6h-7i8j-9k0l1m2n3o4p',
        name: 'Part-time Job',
        color: '#FFCDD2',
        icon: '👔',
        type: 'income',
    },
    {
        uuid: '8z9y0x1w-2v3u-4t5s-6r7q-8p9o0n1m2l3k',
        name: 'Art Sales',
        color: '#B39DDB',
        icon: '🎨',
        type: 'income',
    },
    {
        uuid: '7y8z9x0w-1v2u-3t4s-5r6q-7p8o9n0m1l2k',
        name: 'Workshops & Seminars',
        color: '#FFF176',
        icon: '🏫',
        type: 'income',
    },
] satisfies Category[];
