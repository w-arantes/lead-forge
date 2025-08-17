import { DollarSign, Download, Target, TrendingUp, Users } from "lucide-react";
import { StatsCardsSkeleton } from "@/components/features/stats-skeleton";
import { Button } from "@/components/ui/button";
import type { Lead, Opportunity } from "@/domain/models";
import { LEAD_STATUSES } from "@/domain/models";

type Filter = { status?: string; search?: string };

interface StatsCardsProps {
	leads: Lead[];
	opportunities: Opportunity[];
	loading?: boolean;
	onFilterChange: (filter: Filter) => void;
	onExport: () => void;
}

export function StatsCards({
	leads,
	opportunities,
	loading,
	onFilterChange,
	onExport,
}: StatsCardsProps) {
	const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];
	const safeLeads = Array.isArray(leads) ? leads : [];

	const formatNumber = (n: number) => n.toLocaleString();
	const totalLeads = safeLeads.length;
	const qualifiedLeads = safeLeads.filter(
		(lead) => lead.status === LEAD_STATUSES.QUALIFIED,
	).length;
	const hotLeads = safeLeads.filter(
		(lead) => lead.status === LEAD_STATUSES.HOT,
	).length;
	const convertedLeads = safeLeads.filter(
		(lead) => lead.status === LEAD_STATUSES.CONVERTED,
	).length;

	const totalValue = safeOpportunities.reduce(
		(sum, opp) => sum + (opp.amount || 0),
		0,
	);

	const stats = [
		{
			name: "Total Leads",
			value: totalLeads,
			icon: Users,
			color:
				"bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
			filter: undefined as Filter | undefined,
			description: "All leads in the system",
		},
		{
			name: "Qualified Leads",
			value: qualifiedLeads,
			icon: Target,
			color:
				"bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
			filter: { status: LEAD_STATUSES.QUALIFIED },
			description: "Leads ready for conversion",
		},
		{
			name: "Hot Leads",
			value: hotLeads,
			icon: TrendingUp,
			color: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
			filter: { status: LEAD_STATUSES.HOT },
			description: "High-priority leads",
		},
		{
			name: "Converted",
			value: convertedLeads,
			icon: DollarSign,
			color:
				"bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
			filter: { status: LEAD_STATUSES.CONVERTED },
			description: "Successfully converted leads",
		},
	];

	// Add conversion rate calculation
	const conversionRate =
		totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

	const handleStatClick = (filter?: Filter) => {
		if (filter) {
			onFilterChange(filter);
		}
	};

	return (
		<div className="space-y-6" data-testid="stats-cards">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="font-bold text-2xl text-foreground dark:text-white">
						Dashboard
					</h1>
					<p className="text-muted-foreground">
						Monitor your leads and opportunities
					</p>
				</div>
				<Button
					type="button"
					aria-label="Export leads as CSV"
					onClick={onExport}
					variant="outline"
					className="gap-2"
					data-testid="export-button"
				>
					<Download className="h-4 w-4" />
					Export Leads
				</Button>
			</div>

			{loading ? (
				<StatsCardsSkeleton />
			) : (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
					{stats.map((stat) => {
						const CardTag = stat.filter ? "button" : "div";
						return (
							<CardTag
								key={stat.name}
								type={stat.filter ? "button" : undefined}
								aria-label={
									stat.filter ? `${stat.name} — filter list` : stat.name
								}
								className={`group hover-lift relative rounded-xl border bg-card p-6 ${
									stat.filter
										? "hover-scale cursor-pointer ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
										: ""
								}`}
								onClick={
									stat.filter ? () => handleStatClick(stat.filter) : undefined
								}
								data-testid={stat.name.toLowerCase().replace(/\s+/g, "-")}
							>
								<div className="flex items-center justify-between">
									<div>
										<p className="mb-1 font-medium text-muted-foreground text-sm">
											{stat.name}
										</p>
										<p className="font-bold text-3xl text-foreground dark:text-white">
											{formatNumber(stat.value)}
										</p>
										<p className="mt-1 text-muted-foreground text-xs">
											{stat.description}
										</p>
									</div>
									<div className={`rounded-lg p-3 ${stat.color}`}>
										<stat.icon className="h-6 w-6" />
									</div>
								</div>

								{stat.filter && (
									<div className="absolute inset-0 rounded-xl border-2 border-transparent transition-colors duration-200 group-hover:border-primary/20" />
								)}
							</CardTag>
						);
					})}
				</div>
			)}

			{/* Pipeline Value Card */}
			<div
				className="hover-lift hover-scale rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-6"
				data-testid="total-value"
			>
				<div className="flex items-center justify-between">
					<div>
						<h3 className="font-semibold text-lg dark:text-white">
							Pipeline Value
						</h3>
						<p className="font-bold text-3xl text-primary">
							${totalValue.toLocaleString()}
						</p>
						<p className="mt-1 text-muted-foreground text-sm">
							Total value of all opportunities
						</p>
					</div>
					<div className="rounded-lg bg-primary/10 p-4">
						<DollarSign className="h-8 w-8 text-primary" />
					</div>
				</div>
			</div>

			{/* Conversion Rate Card */}
			<div
				className="hover-lift hover-scale rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-green-100 p-6"
				data-testid="conversion-rate"
			>
				<div className="flex items-center justify-between">
					<div>
						<h3 className="font-semibold text-green-800 text-lg">
							Conversion Rate
						</h3>
						<p className="font-bold text-3xl text-green-600">
							{conversionRate}%
						</p>
						<p className="mt-1 text-green-700 text-sm">
							Leads converted to opportunities
						</p>
					</div>
					<div className="rounded-lg bg-green-200 p-4">
						<Target className="h-8 w-8 text-green-600" />
					</div>
				</div>
			</div>
		</div>
	);
}
