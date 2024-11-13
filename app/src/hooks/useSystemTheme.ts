import { useEffect, useState } from "react";
import type { Theme } from "@/components/theme-provider";

export function useSystemTheme(): Theme {
	const [systemTheme, setSystemTheme] = useState<Theme>(
		window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light",
	);

	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleThemeChange = (event: MediaQueryListEvent) => {
			setSystemTheme(event.matches ? "dark" : "light");
		};

		mediaQuery.addEventListener("change", handleThemeChange);
		return () => mediaQuery.removeEventListener("change", handleThemeChange);
	}, []);

	return systemTheme;
}
