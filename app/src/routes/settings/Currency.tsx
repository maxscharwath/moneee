import { Container } from '@/components/container'
import { Header, HeaderTitle } from '@/components/header'
import { Button } from '@/components/ui/button'
import * as List from '@/components/ui/list'
import { useAsync } from '@/hooks/useAsync'
import { useSettings } from '@/hooks/useSettings'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { CheckIcon, ChevronLeft } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'

type Currency = {
	code: string;
	symbol: string;
	name: string;
	locales: string[];
};

const CurrencyItem = ({ code, name }: Currency) => (
	<RadioGroup.Item asChild value={code} key={code}>
		<List.ItemButton>
			<span className="font-bold text-muted-foreground">{code}</span>
			<span className="truncate">{name}</span>
			<RadioGroup.Indicator asChild>
				<CheckIcon className="ml-auto shrink-0" />
			</RadioGroup.Indicator>
		</List.ItemButton>
	</RadioGroup.Item>
);

export function Component() {
	const { t } = useTranslation();
	const [settings, setSettings] = useSettings();
	const { data } = useAsync<Currency[]>(
		async () => (await import("../../assets/currencies.json")).default,
		[],
	);

	const handleCurrencyChange = (currency: string) => {
		setSettings({ currency });
	};

	const suggestedCurrencies = useMemo(() => {
		const languageSet = new Set(navigator.languages);
		return (
			data?.filter(({ locales }) =>
				locales.some((locale) => languageSet.has(locale)),
			) ?? []
		);
	}, [data]);

	const remainingCurrencies = useMemo(() => {
		return (
			data?.filter(
				({ code }) => !suggestedCurrencies.some((c) => c.code === code),
			) ?? []
		);
	}, [data, suggestedCurrencies]);

	return (
		<>
			<Header>
				<Button variant="ghost" size="icon" asChild>
					<NavLink
						to="/settings"
						className="flex items-center gap-2"
						state={{ direction: "left" }}
					>
						<ChevronLeft />
					</NavLink>
				</Button>
				<HeaderTitle>{t("settings.currency.title")}</HeaderTitle>
			</Header>
			<Container>
				<RadioGroup.Root
					value={settings?.currency}
					onValueChange={handleCurrencyChange}
				>
					<List.Root>
						{suggestedCurrencies.length > 0 && (
							<List.List heading={t("settings.currency.suggested")}>
								{suggestedCurrencies.map(CurrencyItem)}
							</List.List>
						)}
						<List.List>{remainingCurrencies.map(CurrencyItem)}</List.List>
					</List.Root>
				</RadioGroup.Root>
			</Container>
		</>
	);
}

Component.displayName = "Settings.Currency";
