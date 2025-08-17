import type { ReactNode } from "react";
import { useEffect } from "react";
import {
	STORAGE_KEYS,
	THEME_VALUES,
	DEFAULT_THEME,
	THEME_CLASSES,
} from "@/constants";

import { ErrorBoundary } from "@/components/layout";

function getSystemTheme(): string {
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? THEME_CLASSES.DARK
		: THEME_CLASSES.LIGHT;
}

function applyThemeClass(themeClass: string): void {
	const root = document.documentElement;
	root.classList.remove(THEME_CLASSES.LIGHT, THEME_CLASSES.DARK);
	root.classList.add(themeClass);
}

function initializeTheme(): void {
	try {
		const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);

		if (savedTheme === THEME_VALUES.SYSTEM) {
			const systemTheme = getSystemTheme();
			applyThemeClass(systemTheme);
		} else if (
			savedTheme === THEME_VALUES.LIGHT ||
			savedTheme === THEME_VALUES.DARK
		) {
			applyThemeClass(savedTheme);
		} else {
			applyThemeClass(DEFAULT_THEME);
		}
	} catch (error) {
		console.warn("Failed to initialize theme:", error);
		applyThemeClass(DEFAULT_THEME);
	}
}

function setupThemeListener(): () => void {
	const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

	const handleThemeChange = (e: MediaQueryListEvent): void => {
		try {
			const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
			if (savedTheme === THEME_VALUES.SYSTEM) {
				const newSystemTheme = e.matches
					? THEME_CLASSES.DARK
					: THEME_CLASSES.LIGHT;
				applyThemeClass(newSystemTheme);
			}
		} catch (error) {
			console.warn("Failed to handle system theme change:", error);
		}
	};

	mediaQuery.addEventListener("change", handleThemeChange);

	return () => {
		mediaQuery.removeEventListener("change", handleThemeChange);
	};
}

interface ProvidersWrapperProps {
	children: ReactNode;
}

export function ProvidersWrapper({ children }: ProvidersWrapperProps) {
	useEffect(() => {
		initializeTheme();
		const cleanup = setupThemeListener();

		return cleanup;
	}, []);

	return <ErrorBoundary>{children}</ErrorBoundary>;
}
