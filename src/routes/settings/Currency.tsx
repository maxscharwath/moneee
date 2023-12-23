import { Header, HeaderTitle } from '@/components/header';
import { useTranslation } from 'react-i18next';
import * as List from '@/components/ui/list';
import { CheckIcon, ChevronLeft } from 'lucide-react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/stores/db';
import { Container } from '@/components/container';
import { useAsync } from '@/hooks/useAsync';

type Currency = {
    code: string;
    name: string;
};

export function Component() {
    const { t } = useTranslation();
    const [settings, setSettings] = useSettings();
    const { data } = useAsync<Currency[]>(
        async () => (await import('../../assets/currencies.json')).default,
        []
    );

    const handleCurrencyChange = (currency: string) => {
        setSettings({ currency });
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
                <HeaderTitle>{t('settings.currency.title')}</HeaderTitle>
            </Header>
            <Container>
                <RadioGroup.Root
                    value={settings?.currency}
                    onValueChange={handleCurrencyChange}
                >
                    <List.Root>
                        <List.List>
                            {data?.map(({ code, name }) => (
                                <RadioGroup.Item
                                    asChild
                                    value={code}
                                    key={code}
                                >
                                    <List.ItemButton>
                                        <span className="font-bold text-muted-foreground">
                                            {code}
                                        </span>
                                        <span className="truncate">{name}</span>
                                        <RadioGroup.Indicator asChild>
                                            <CheckIcon className="ml-auto shrink-0" />
                                        </RadioGroup.Indicator>
                                    </List.ItemButton>
                                </RadioGroup.Item>
                            ))}
                        </List.List>
                    </List.Root>
                </RadioGroup.Root>
            </Container>
        </>
    );
}

Component.displayName = 'Settings.Currency';
