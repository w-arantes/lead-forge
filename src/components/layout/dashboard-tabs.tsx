import { useEffect } from "react";
import { Kbd } from "@/components/ui/kbd";
import { useShortcutsEnabled } from "@/domain/infra/store";
import { cn } from "@/lib/utils";

export type DashboardTab = "leads" | "opportunities" | "analytics";

interface DashboardTabsProps {
	active: DashboardTab;
	onChange: (tab: DashboardTab) => void;
	className?: string;
	idPrefix?: string;
}

export function DashboardTabs({
	active,
	onChange,
	className,
	idPrefix,
}: DashboardTabsProps) {
	const shortcutsEnabled = useShortcutsEnabled();

	const tabs: Array<{ id: DashboardTab; label: string; shortcut: string }> = [
		{ id: "leads", label: "Leads", shortcut: "L" },
		{ id: "opportunities", label: "Opportunities", shortcut: "O" },
		{ id: "analytics", label: "Analytics", shortcut: "A" },
	];

	useEffect(() => {
		if (!shortcutsEnabled) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey || e.metaKey) {
				switch (e.key.toLowerCase()) {
					case "l":
						e.preventDefault();
						onChange("leads");
						break;
					case "o":
						e.preventDefault();
						onChange("opportunities");
						break;
					case "a":
						e.preventDefault();
						onChange("analytics");
						break;
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [shortcutsEnabled, onChange]);

	return (
		<div
			className={cn("border-border border-b", className)}
			data-testid="dashboard-tabs"
		>
			{shortcutsEnabled && (
				<div className="flex items-center justify-between px-6 py-2">
					<div className="text-muted-foreground text-xs">
						Use <Kbd>Ctrl</Kbd> + <Kbd>L</Kbd>, <Kbd>O</Kbd>, <Kbd>A</Kbd> to
						navigate
					</div>
				</div>
			)}

			<nav className="-mb-px flex space-x-8 px-6" aria-label="Dashboard Tabs">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						role="tab"
						id={idPrefix ? `${idPrefix}-tab-${tab.id}` : undefined}
						aria-selected={active === tab.id}
						aria-controls={idPrefix ? `${idPrefix}-panel-${tab.id}` : undefined}
						className={cn(
							"border-b-2 px-1 py-4 font-medium text-sm transition-colors",
							active === tab.id
								? "border-primary text-primary"
								: "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
						)}
						onClick={() => onChange(tab.id)}
						data-testid={`tab-${tab.id}`}
					>
						{tab.label}
						{shortcutsEnabled && (
							<span className="ml-2 hidden lg:inline">
								<Kbd className="text-xs">{tab.shortcut}</Kbd>
							</span>
						)}
					</button>
				))}
			</nav>
		</div>
	);
}
