import { Container } from "@/components/container";
import { Header, HeaderTitle } from "@/components/header";
import { Button } from "@/components/ui/button";
import * as List from "@/components/ui/list";
import { useAsync } from "@/hooks/useAsync";
import { useSettings } from "@/hooks/useSettings";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { CheckIcon, ChevronLeft } from "lucide-react";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const CurrencyItem = memo<{ code: string }>(({ code }) => {
	const { t } = useTranslation();
	return (
		<RadioGroup.Item asChild value={code}>
			<List.ItemButton>
				<span className="font-bold text-muted-foreground">{code}</span>
				<span className="truncate capitalize">{t(`currencies.${code}`)}</span>
				<RadioGroup.Indicator asChild>
					<CheckIcon className="ml-auto shrink-0" />
				</RadioGroup.Indicator>
			</List.ItemButton>
		</RadioGroup.Item>
	);
});

type Currency = {
	code: string;
	symbol: string;
	locales: string[];
};

const initCurrencies = async () =>
	(await import("@/assets/currencies.yml")).default as Array<Currency>;

export function Component() {
	const { t } = useTranslation();
	const [settings, setSettings] = useSettings();
	const { data } = useAsync(initCurrencies, []);

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
								{suggestedCurrencies.map((currency) => (
									<CurrencyItem key={currency.code} code={currency.code} />
								))}
							</List.List>
						)}
						<List.List>
							{remainingCurrencies.map((currency) => (
								<CurrencyItem key={currency.code} code={currency.code} />
							))}
						</List.List>
					</List.Root>
				</RadioGroup.Root>
			</Container>
		</>
	);
}

Component.displayName = "Settings.Currency";
