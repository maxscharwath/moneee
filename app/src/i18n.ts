import { useSettings } from "@/hooks/useSettings";
import { type DateLike, formatNullable, type Nullable } from "@/lib/utils";
import { de, enUS, es, fr, frCH, it, itCH, ja, pt, vi, zhCN } from "date-fns/locale";
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
      async (language: string) => import(`./locales/${language}.yml`)
    )
  )
  .init({
    fallbackLng: "en"
  });

export const languages = [
  {
    code: "en",
    name: "English",
    locale: enUS,
    icon: "🇺🇸"
  },
  {
    code: "fr-FR",
    name: "Français",
    locale: fr,
    icon: "🇫🇷"
  },
  {
    code: "fr-CH",
    name: "Français (Suisse)",
    locale: frCH,
    icon: "🇨🇭"
  },
  {
    code: "de",
    name: "Deutsch",
    locale: de,
    icon: "🇩🇪"
  },
  {
    code: "de-CH",
    name: "Deutsch (Schweiz)",
    locale: de,
    icon: "🇨🇭"
  },
  {
    code: "es",
    name: "Español",
    locale: es,
    icon: "🇪🇸"
  },
  {
    code: "pt",
    name: "Português",
    locale: pt,
    icon: "🇵🇹"
  },
  {
    code: "it",
    name: "Italiano",
    locale: it,
    icon: "🇮🇹"
  },
  {
    code: "it-CH",
    name: "Italiano (Svizzera)",
    locale: itCH,
    icon: "🇨🇭"
  },
  {
    code: "vi",
    name: "Tiếng Việt",
    locale: vi,
    icon: "🇻🇳"
  },
  {
    code: "ja",
    name: "日本語",
    locale: ja,
    icon: "🇯🇵"
  },
  {
    code: "zh-CN",
    name: "简体中文",
    locale: zhCN,
    icon: "🇨🇳"
  },
  {
    code: "pirate",
    name: "Pirate Speak",
    locale: enUS,
    icon: "🏴‍☠️"
  },
  {
    code: "cimode",
    name: "Debug",
    locale: enUS,
    icon: "🐛"
  }
] as const;

export const useLocale = () => {
  const translation = useTranslation();
  const [settings] = useSettings();
  const currency = useCallback(
    (amount: number, options?: Intl.NumberFormatOptions) =>
      amount.toLocaleString(translation.i18n.language, {
        style: "currency",
        currency: settings?.currency ?? "USD",
        ...options
      }),
    [translation.i18n.language, settings?.currency]
  );

  const date = useCallback(
    <T extends Nullable<DateLike>> (
      date: Date,
      options?: Intl.DateTimeFormatOptions
    ) =>
      formatNullable(date, (date) =>
        new Date(date).toLocaleDateString(translation.i18n.language, options)
      ),
    [translation.i18n.language]
  );

  const time = useCallback(
    <T extends Nullable<DateLike>> (
      date: T,
      options?: Intl.DateTimeFormatOptions
    ) =>
      formatNullable(date, (date) =>
        new Date(date).toLocaleTimeString(translation.i18n.language, options)
      ),
    [translation.i18n.language]
  );

  const dateTime = useCallback(
    <T extends Nullable<DateLike>> (
      date: T,
      options?: Intl.DateTimeFormatOptions
    ) =>
      formatNullable(date, (date) =>
        new Date(date).toLocaleString(translation.i18n.language, options)
      ),
    [translation.i18n.language]
  );

  const language = useMemo(
    () => languages.find(({ code }) => code === translation.i18n.language),
    [translation.i18n.language]
  );

  return {
    ...translation,
    language,
    languages,
    formatter: {
      currency,
      date,
      time,
      dateTime
    }
  };
};
