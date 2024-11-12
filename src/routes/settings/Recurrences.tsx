import { Header, HeaderTitle } from '@/components/header';
import { useTranslation } from 'react-i18next';
import * as List from '@/components/ui/list';
import { CalendarClockIcon, ChevronLeft, XIcon } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/container';
import { useMemo } from 'react';
import { useCategories } from '@/hooks/useCategory';
import { deleteRecurrence, getRecurrences } from '@/hooks/useRecurrence';
import { Spacing } from '@/components/spacing';
import { Badge } from '@/components/ui/badge';
import { Currency } from '@/components/currency';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function Component() {
    const { t } = useTranslation();
    const { result: recurrences } = getRecurrences();
    const { result: categories = [] } = useCategories();
    const categoryMap = useMemo(
        () => new Map(categories.map((category) => [category.uuid, category])),
        [categories]
    );

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
                <HeaderTitle>{t('settings.root.recurrences')}</HeaderTitle>
            </Header>
            <Container>
                <List.Root>
                    {recurrences?.length > 0 ? (
                        <List.List>
                            {recurrences?.map((recurrence) => {
                                const category = categoryMap.get(
                                    recurrence.categoryId
                                );
                                return (
                                    <List.ItemButton key={recurrence.uuid}>
                                        <List.ItemIcon
                                            style={{
                                                backgroundColor:
                                                    category?.color,
                                            }}
                                        >
                                            {category?.icon}
                                        </List.ItemIcon>
                                        <span className="truncate">
                                            {category?.name}
                                        </span>
                                        <Badge>
                                            <Currency
                                                amount={recurrence.amount}
                                            />
                                        </Badge>
                                        <Badge>{recurrence.cron}</Badge>
                                        <Spacing />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() =>
                                                deleteRecurrence(recurrence)
                                            }
                                        >
                                            <XIcon />
                                        </Button>
                                    </List.ItemButton>
                                );
                            })}
                        </List.List>
                    ) : (
                        <Alert align="center">
                            <CalendarClockIcon className="h-4 w-4" />
                            <AlertTitle>
                                {t('recurrences.noRecurrences.title')}
                            </AlertTitle>
                            <AlertDescription>
                                {t('recurrences.noRecurrences.description')}
                            </AlertDescription>
                        </Alert>
                    )}
                </List.Root>
            </Container>
        </>
    );
}

Component.displayName = 'Settings.Recurrences';
