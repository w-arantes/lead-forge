import { ChevronDown, Monitor, Moon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/constants/storage";

type Theme = "light" | "dark" | "system";

export function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>("dark");
	const [isOpen, setIsOpen] = useState(false);

	const applyTheme = useCallback((selectedTheme: Theme) => {
		const root = document.documentElement;

		if (selectedTheme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";
			root.classList.toggle("dark", systemTheme === "dark");
		} else {
			root.classList.toggle("dark", selectedTheme === "dark");
		}
	}, []);

	useEffect(() => {
		// Get theme from localStorage or system preference
		const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as Theme;
		if (savedTheme) {
			setTheme(savedTheme);
			applyTheme(savedTheme);
		} else {
			// Check system preference
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
				.matches
				? "dark"
				: "light";
			setTheme("system");
			applyTheme(systemTheme);
		}
	}, [applyTheme]);

	const handleThemeChange = (newTheme: Theme) => {
		setTheme(newTheme);
		localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
		applyTheme(newTheme);
		setIsOpen(false);
	};

	const getThemeIcon = () => {
		switch (theme) {
			case "light":
				return <Sun className="h-4 w-4" />;
			case "dark":
				return <Moon className="h-4 w-4" />;
			case "system":
				return <Monitor className="h-4 w-4" />;
			default:
				return <Monitor className="h-4 w-4" />;
		}
	};

	const getThemeLabel = () => {
		switch (theme) {
			case "light":
				return "Light";
			case "dark":
				return "Dark";
			case "system":
				return "System";
			default:
				return "System";
		}
	};

	return (
		<div className="relative">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="hover-lift flex items-center gap-2 rounded-lg border border-border/50 bg-muted/50 px-3 py-2 transition-all duration-200 hover:bg-muted"
				aria-label="Select theme"
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				data-testid="theme-toggle"
			>
				{getThemeIcon()}
				<span className="font-medium text-foreground text-sm">
					{getThemeLabel()}
				</span>
				<ChevronDown
					className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
				/>
			</button>

			{/* Backdrop */}
			<div
				className={`fixed inset-0 z-10 transition-opacity duration-200 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
				onClick={() => setIsOpen(false)}
				aria-hidden="true"
			/>

			{/* Dropdown */}
			<div
				className={`absolute top-full right-0 z-20 mt-2 w-40 rounded-lg border border-border bg-card py-1 shadow-lg transition-all duration-200 ${
					isOpen
						? "translate-y-0 opacity-100"
						: "pointer-events-none translate-y-2 opacity-0"
				}`}
			>
				<button
					type="button"
					onClick={() => handleThemeChange("light")}
					className={`flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-muted ${
						theme === "light" ? "text-primary" : "text-foreground"
					}`}
				>
					<Sun className="h-4 w-4" />
					Light
				</button>

				<button
					type="button"
					onClick={() => handleThemeChange("dark")}
					className={`flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-muted ${
						theme === "dark" ? "text-primary" : "text-foreground"
					}`}
				>
					<Moon className="h-4 w-4" />
					Dark
				</button>

				<button
					type="button"
					onClick={() => handleThemeChange("system")}
					className={`flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-muted ${
						theme === "system" ? "text-primary" : "text-foreground"
					}`}
				>
					<Monitor className="h-4 w-4" />
					System
				</button>
			</div>
		</div>
	);
}
