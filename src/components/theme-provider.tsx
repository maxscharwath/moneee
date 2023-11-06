import type React from 'react';
import {type ReactNode, useEffect, useState} from 'react';
import {useSettings} from '@/stores/db.ts';

export type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
	children: ReactNode;
	defaultTheme?: Theme;
};

export function useSystemTheme(): Theme {
	const [systemTheme, setSystemTheme] = useState<Theme>(
		window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
	);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleThemeChange = (event: MediaQueryListEvent) => {
			setSystemTheme(event.matches ? 'dark' : 'light');
		};

		mediaQuery.addEventListener('change', handleThemeChange);
		return () => mediaQuery.removeEventListener('change', handleThemeChange);
	}, []);

	return systemTheme;
}

export const ThemeProvider: React.FC<ThemeProviderProps>
	= ({children, defaultTheme = 'system'}) => {
		const [settings] = useSettings();
		const systemTheme = useSystemTheme();
		const effectiveTheme = settings?.appearance ?? defaultTheme;

		useEffect(() => {
			const root = document.documentElement;
			const appliedTheme = effectiveTheme === 'system' ? systemTheme : effectiveTheme;

			root.classList.remove('light', 'dark');
			root.classList.add(appliedTheme);
		}, [effectiveTheme, systemTheme]);

		return children;
	};
