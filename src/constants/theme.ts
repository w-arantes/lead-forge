export const THEME_VALUES = {
	LIGHT: "light",
	DARK: "dark",
	SYSTEM: "system",
} as const;

export type ThemeValue = (typeof THEME_VALUES)[keyof typeof THEME_VALUES];

export const DEFAULT_THEME: ThemeValue = THEME_VALUES.LIGHT;

export const THEME_CLASSES = {
	LIGHT: THEME_VALUES.LIGHT,
	DARK: THEME_VALUES.DARK,
} as const;

export type ThemeClass = (typeof THEME_CLASSES)[keyof typeof THEME_CLASSES];
