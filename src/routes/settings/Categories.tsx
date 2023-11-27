import { Header, HeaderTitle } from '@/components/header';
import { useTranslation } from 'react-i18next';
import * as List from '@/components/ui/list';
import { ChevronLeft } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { addCategory, getCategoriesByType } from '@/stores/db';
import { Container } from '@/components/container';
import * as TabsGroup from '@/components/ui/tabs-group';
import React from 'react';
import { CategoryModal } from '@/components/category-modal';
import { Category } from '@/stores/schemas/category';
import { Optional } from '@/lib/utils';

export function Component() {
    const { t } = useTranslation();
    const [type, setType] = React.useState<'income' | 'expense'>('expense');
    const { result: categories } = getCategoriesByType(type);
    const [category, setCategory] = React.useState<Category | undefined>();
    const handleCategory = (category: Optional<Category, 'uuid'>) => {
        void addCategory(category);
        setCategory(undefined);
    };
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
                <div className="flex w-full items-center justify-center gap-4">
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
                </div>
                <List.Root>
                    <List.List>
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
                </List.Root>
            </Container>
            <CategoryModal
                category={category}
                open={!!category}
                onOpenChange={(open) => !open && setCategory(undefined)}
                onCategory={handleCategory}
                key={category?.uuid}
            />
        </>
    );
}

Component.displayName = 'Settings.Categories';
