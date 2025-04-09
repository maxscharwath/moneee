import { expenseCategories, incomeCategories } from '@/assets/categories'
import { CategoryModal } from '@/components/category-modal'
import { Container } from '@/components/container'
import { Header, HeaderTitle } from '@/components/header'
import { Spacing } from '@/components/spacing'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import * as List from '@/components/ui/list'
import * as TabsGroup from '@/components/ui/tabs-group'
import { addCategory, removeCategory, useCategoriesByType, } from '@/hooks/useCategory'
import type { Optional } from '@/lib/utils'
import type { Category } from '@/stores/schemas/category'
import { ChevronLeft, LayoutGridIcon, PlusIcon } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

export function Component () {
  const { t } = useTranslation()
  const [type, setType] = useState<'income' | 'expense'>('expense')
  const { result: categories } = useCategoriesByType(type)
  const [category, setCategory] = useState<Partial<Category> | undefined>()
  const handleCategory = (category: Optional<Category, 'uuid'>) => {
    void addCategory(category)
    setCategory(undefined)
  }

  const handleDeleteCategory = (uuid: string) => {
    console.log('delete category', uuid)
    void removeCategory(uuid)
    setCategory(undefined)
  }

  const suggestedCategories = useMemo(() => {
    return (type === 'expense' ? expenseCategories : incomeCategories)
      .filter((category) => !categories?.find((c) => c.uuid === category.uuid))
      .map((category) => ({ ...category, name: t(category.name) }))
  }, [categories, t, type])

  return (
    <>
      <Header>
        <Button variant="ghost" size="icon" asChild>
          <NavLink
            to="/settings"
            className="flex items-center gap-2"
            state={{ direction: 'left' }}
          >
            <ChevronLeft/>
          </NavLink>
        </Button>
        <HeaderTitle>{t('settings.root.categories')}</HeaderTitle>
      </Header>
      <Container>
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div/>
          <TabsGroup.Root
            value={type}
            onValueChange={(t) => {
              setType(t as 'income' | 'expense')
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
              <PlusIcon/>
            </Button>
          </div>
        </div>
        <List.Root>
          {categories?.length > 0 ? (
            <List.List heading={t('settings.root.categories')}>
              {categories?.map((category) => (
                <List.ItemButton
                  key={category.uuid}
                  onClick={() => setCategory(category)}
                >
                  <List.ItemIcon color={category.color}>
                    {category.icon}
                  </List.ItemIcon>
                  <span className="truncate">{category.name}</span>
                </List.ItemButton>
              ))}
            </List.List>
          ) : (
            <Alert align="center" variant="default">
              <LayoutGridIcon className="h-4 w-4"/>
              <AlertTitle>{t('settings.category.noCategory.title')}</AlertTitle>
              <AlertDescription>
                {t('settings.category.noCategory.description')}
              </AlertDescription>
            </Alert>
          )}

          {suggestedCategories.length > 0 && (
            <List.List heading={t('settings.category.suggested')}>
              {suggestedCategories.map((category) => (
                <List.ItemButton
                  key={category.uuid}
                  onClick={() => addCategory(category)}
                >
                  <List.ItemIcon color={category.color}>
                    {category.icon}
                  </List.ItemIcon>
                  <span className="truncate">{category.name}</span>
                  <Spacing/>
                  <div className="rounded-full bg-muted-foreground/30 p-1 text-muted-foreground">
                    <PlusIcon/>
                  </div>
                </List.ItemButton>
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
  )
}

Component.displayName = 'Settings.Categories'
