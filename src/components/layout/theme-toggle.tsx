import { ChevronDown, Monitor, Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { STORAGE_KEYS } from "@/constants/storage";

const Theme = {
	LIGHT: "light",
	DARK: "dark",
	SYSTEM: "system",
} as const;

type ThemeValue = (typeof Theme)[keyof typeof Theme];

interface ThemeOption {
	value: ThemeValue;
	label: string;
	icon: React.ReactNode;
}

export function ThemeToggle() {
	const [theme, setTheme] = useState<ThemeValue>(Theme.DARK);
	const [isOpen, setIsOpen] = useState(false);

	const getThemeOptions = (): ThemeOption[] => [
		{ value: Theme.LIGHT, label: "Light", icon: <Sun className="size-4" /> },
		{ value: Theme.DARK, label: "Dark", icon: <Moon className="size-4" /> },
		{
			value: Theme.SYSTEM,
			label: "System",
			icon: <Monitor className="size-4" />,
		},
	];

	const applyTheme = useCallback((selectedTheme: ThemeValue) => {
		const root = document.documentElement;
		const isDark =
			selectedTheme === Theme.SYSTEM
				? window.matchMedia("(prefers-color-scheme: dark)").matches
				: selectedTheme === Theme.DARK;

		root.classList.toggle("dark", isDark);
	}, []);

	useEffect(() => {
		const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeValue;
		if (savedTheme && Object.values(Theme).includes(savedTheme)) {
			setTheme(savedTheme);
			applyTheme(savedTheme);
		} else {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? Theme.DARK
				: Theme.LIGHT;
			setTheme(Theme.SYSTEM);
			applyTheme(systemTheme);
		}
	}, [applyTheme]);

	const handleThemeChange = (newTheme: ThemeValue) => {
		setTheme(newTheme);
		localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
		applyTheme(newTheme);
		setIsOpen(false);
	};

	const themeOptions = getThemeOptions();
	const currentTheme =
		themeOptions.find((option) => option.value === theme) || themeOptions[2];

	return (
		<div className="relative">
			<Button
				variant="outline"
				size="sm"
				onClick={() => setIsOpen(!isOpen)}
				className="hover-lift flex items-center gap-2 transition-all duration-200"
				aria-label="Select theme"
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				data-testid="theme-toggle"
			>
				{currentTheme.icon}
				<span className="font-medium text-sm">{currentTheme.label}</span>
				<ChevronDown
					className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
				/>
			</Button>

			{isOpen && (
				<>
					<div
						className="fixed inset-0 z-10"
						onClick={() => setIsOpen(false)}
						aria-hidden="true"
					/>

					<div className="absolute top-full right-0 z-20 mt-2 w-40 rounded-lg border border-border bg-card py-1 shadow-lg">
						{themeOptions.map((option) => (
							<Button
								key={option.value}
								variant="ghost"
								size="sm"
								onClick={() => handleThemeChange(option.value)}
								className={`w-full justify-start px-3 py-2 text-sm ${
									theme === option.value ? "text-primary" : "text-foreground"
								}`}
							>
								{option.icon}
								{option.label}
							</Button>
						))}
					</div>
				</>
			)}
		</div>
	);
}
