import { useSettings } from "@/hooks/useSettings";
import { type DateLike, type Nullable, formatNullable } from "@/lib/utils";
import {
	de,
	enUS,
	es,
	fr,
	frCH,
	it,
	itCH,
	ja,
	vi,
	zhCN,
} from "date-fns/locale";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { useCallback, useMemo } from "react";
import { initReactI18next, useTranslation } from "react-i18next";

export default i18n
	.use(initReactI18next)
	.use(LanguageDetector)
	.use(
		resourcesToBackend(
			async (language: string) => import(`./locales/${language}.yml`),
		),
	)
	.init({
		fallbackLng: "en",
	});

export const languages = [
	{
		code: "en",
		locale: enUS,
		icon: "🇺",
	},
	{
		code: "fr-FR",
		locale: fr,
		icon: "🇫",
	},
	{
		code: "fr-CH",
		locale: frCH,
		icon: "🇨",
	},
	{
		code: "de",
		locale: de,
		icon: "🇩",
	},
	{
		code: "de-CH",
		locale: de,
		icon: "🇨",
	},
	{
		code: "es",
		locale: es,
		icon: "🇪",
	},
	{
		code: "it",
		locale: it,
		icon: "🇮",
	},
	{
		code: "it-CH",
		locale: itCH,
		icon: "🇨",
	},
	{
		code: "vi",
		locale: vi,
		icon: "🇻",
	},
	{
		code: "ja",
		locale: ja,
		icon: "🇯",
	},
	{
		code: "zh-CN",
		locale: zhCN,
		icon: "🇨",
	},
	{
		code: "pirate",
		locale: enUS,
		icon: "🏴",
	},
	{
		code: "cimode",
		locale: enUS,
		icon: "🐛",
	},
];

export const useLocale = () => {
	const translation = useTranslation();
	const [settings] = useSettings();
	const currency = useCallback(
		(amount: number, options?: Intl.NumberFormatOptions) =>
			amount.toLocaleString(translation.i18n.language, {
				style: "currency",
				currency: settings?.currency ?? "USD",
				...options,
			}),
		[translation.i18n.language, settings?.currency],
	);

	const date = useCallback(
		<T extends Nullable<DateLike>>(
			date: Date,
			options?: Intl.DateTimeFormatOptions,
		) =>
			formatNullable(date, (date) =>
				new Date(date).toLocaleDateString(translation.i18n.language, options),
			),
		[translation.i18n.language],
	);

	const time = useCallback(
		<T extends Nullable<DateLike>>(
			date: T,
			options?: Intl.DateTimeFormatOptions,
		) =>
			formatNullable(date, (date) =>
				new Date(date).toLocaleTimeString(translation.i18n.language, options),
			),
		[translation.i18n.language],
	);

	const dateTime = useCallback(
		<T extends Nullable<DateLike>>(
			date: T,
			options?: Intl.DateTimeFormatOptions,
		) =>
			formatNullable(date, (date) =>
				new Date(date).toLocaleString(translation.i18n.language, options),
			),
		[translation.i18n.language],
	);

	const language = useMemo(
		() => languages.find(({ code }) => code === translation.i18n.language),
		[translation.i18n.language],
	);

	return {
		...translation,
		language,
		languages,
		formatter: {
			currency,
			date,
			time,
			dateTime,
		},
	};
};
