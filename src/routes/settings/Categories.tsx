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
import { expenseCategories, incomeCategories } from '@/assets/categories';

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
