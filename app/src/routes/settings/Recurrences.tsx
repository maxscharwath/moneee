import { Container } from '@/components/container'
import { Currency } from '@/components/currency'
import { Header, HeaderTitle } from '@/components/header'
import { RecurrentModal } from '@/components/recurrent-modal'
import { Spacing } from '@/components/spacing'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import * as List from '@/components/ui/list'
import { useCategories } from '@/hooks/useCategory'
import { deleteRecurrence, useRecurrences } from '@/hooks/useRecurrence'
import type { Recurrence } from '@/stores/schemas/recurrence'
import { CalendarClockIcon, ChevronLeft, CircleSlash, XIcon, } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

export function Component () {
  const { t } = useTranslation()
  const { result: recurrences } = useRecurrences()
  const { result: categories = [] } = useCategories()
  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.uuid, category])),
    [categories],
  )
  const [recurrence, setRecurrence] = useState<Recurrence | undefined>()

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
        <HeaderTitle>{t('settings.root.recurrences')}</HeaderTitle>
      </Header>
      <Container>
        <List.Root>
          {recurrences?.length > 0 ? (
            <List.List>
              {recurrences?.map((recurrence) => {
                const category = categoryMap.get(recurrence.categoryId)
                return (
                  <List.ItemButton
                    key={recurrence.uuid}
                    onClick={() => setRecurrence(recurrence)}
                  >
                    <List.ItemIcon color={category?.color}>
                      {category?.icon ?? <CircleSlash/>}
                    </List.ItemIcon>
                    <span className="truncate">{category?.name}</span>
                    <Badge>
                      <Currency amount={recurrence.amount}/>
                    </Badge>
                    <Spacing/>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteRecurrence(recurrence)}
                    >
                      <XIcon/>
                    </Button>
                  </List.ItemButton>
                )
              })}
            </List.List>
          ) : (
            <Alert align="center">
              <CalendarClockIcon className="h-4 w-4"/>
              <AlertTitle>{t('recurrences.noRecurrence.title')}</AlertTitle>
              <AlertDescription>
                {t('recurrences.noRecurrence.description')}
              </AlertDescription>
            </Alert>
          )}
        </List.Root>
      </Container>
      <RecurrentModal
        recurrence={recurrence}
        open={!!recurrence}
        onOpenChange={(open) => !open && setRecurrence(undefined)}
      />
    </>
  )
}

Component.displayName = 'Settings.Recurrences'
