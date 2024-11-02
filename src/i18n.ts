import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { useCallback, useMemo } from 'react';
import { de, enUS, es, fr, frCH, it, itCH } from 'date-fns/locale';
import { useSettings } from '@/hooks/useSettings';

export default i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(
        resourcesToBackend(
            async (language: string) => import(`./locales/${language}.json`)
        )
    )
    .init({
        fallbackLng: 'en',
    });

export const languages = [
    {
        code: 'en',
        name: 'English',
        locale: enUS,
    },
    {
        code: 'fr-FR',
        name: 'Français',
        locale: fr,
    },
    {
        code: 'fr-CH',
        name: 'Français (Suisse)',
        locale: frCH,
    },
    {
        code: 'de',
        name: 'Deutsch',
        locale: de,
    },
    {
        code: 'de-CH',
        name: 'Deutsch (Schweiz)',
        locale: de,
    },
    {
        code: 'es',
        name: 'Español',
        locale: es,
    },
    {
        code: 'it',
        name: 'Italiano',
        locale: it,
    },
    {
        code: 'it-CH',
        name: 'Italiano (Svizzera)',
        locale: itCH,
    },
];

export const useLocale = () => {
    const translation = useTranslation();
    const [settings] = useSettings();
    const currency = useCallback(
        (amount: number, options?: Intl.NumberFormatOptions) =>
            amount.toLocaleString(translation.i18n.language, {
                style: 'currency',
                currency: settings?.currency ?? 'USD',
                ...options,
            }),
        [translation.i18n.language, settings?.currency]
    );

    const date = useCallback(
        (date: Date, options?: Intl.DateTimeFormatOptions) =>
            date.toLocaleDateString(translation.i18n.language, options),
        [translation.i18n.language]
    );

    const time = useCallback(
        (date: Date, options?: Intl.DateTimeFormatOptions) =>
            date.toLocaleTimeString(translation.i18n.language, options),
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
        },
    };
};
