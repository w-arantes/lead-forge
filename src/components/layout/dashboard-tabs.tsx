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
	const tabs: Array<{ id: DashboardTab; label: string }> = [
		{ id: "leads", label: "Leads" },
		{ id: "opportunities", label: "Opportunities" },
		{ id: "analytics", label: "Analytics" },
	];

	return (
		<div
			className={cn("border-border border-b", className)}
			data-testid="dashboard-tabs"
		>
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
					</button>
				))}
			</nav>
		</div>
	);
}
