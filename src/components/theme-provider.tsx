import type React from 'react';
import { type ReactNode, useEffect } from 'react';
import { useSystemTheme } from '@/hooks/useSystemTheme';
import { useSettings } from '@/hooks/useSettings';

export type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
    children: ReactNode;
    defaultTheme?: Theme;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultTheme = 'system',
}) => {
    const [settings] = useSettings();
    const systemTheme = useSystemTheme();
    const effectiveTheme = settings?.appearance ?? defaultTheme;

    useEffect(() => {
        const root = document.documentElement;
        const appliedTheme =
            effectiveTheme === 'system' ? systemTheme : effectiveTheme;

        root.classList.remove('light', 'dark');
        root.classList.add(appliedTheme);
    }, [effectiveTheme, systemTheme]);

    return children;
};
