import {
	Activity,
	BarChart3,
	Calendar,
	Clock,
	Target,
	TrendingUp,
	Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Lead, Opportunity } from "@/domain/models";
import { dateUtils } from "@/helpers/date";

interface AnalyticsProps {
	leads: Lead[];
	opportunities: Opportunity[];
	loading?: boolean;
}

type TabType =
	| "overview"
	| "leads"
	| "opportunities"
	| "conversion"
	| "timeline";

export function Analytics({
	leads,
	opportunities,
	loading = false,
}: AnalyticsProps) {
	const [activeTab, setActiveTab] = useState<TabType>("overview");

	const stats = useMemo(() => {
		const totalLeads = leads.length;
		const qualifiedLeads = leads.filter((l) => l.status === "Qualified").length;
		const hotLeads = leads.filter((l) => l.status === "Hot").length;
		const convertedLeads = leads.filter((l) => l.status === "Converted").length;
		const newLeads = leads.filter((l) => l.status === "New").length;

		const totalOpportunities = opportunities.length;
		const totalValue = opportunities.reduce(
			(sum, opp) => sum + (opp.amount || 0),
			0,
		);

		const conversionRate =
			totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

		const leadsBySource = leads.reduce(
			(acc, lead) => {
				acc[lead.source] = (acc[lead.source] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		const leadsByStatus = leads.reduce(
			(acc, lead) => {
				acc[lead.status] = (acc[lead.status] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		const avgScore =
			leads.length > 0
				? leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length
				: 0;

		const now = new Date();

		const leadsThisMonth = leads.filter((l) =>
			dateUtils.isThisMonth(l.createdAt),
		).length;
		const leadsThisWeek = leads.filter((l) =>
			dateUtils.isThisWeek(l.createdAt),
		).length;
		const leadsToday = leads.filter((l) =>
			dateUtils.isToday(l.createdAt),
		).length;

		const avgLeadAge =
			leads.length > 0
				? leads.reduce(
						(sum, l) => sum + dateUtils.getDaysBetween(l.createdAt, now),
						0,
					) / leads.length
				: 0;

		const recentActivity = leads.filter(
			(l) => dateUtils.getDaysBetween(l.createdAt, now) <= 7,
		).length;

		return {
			totalLeads,
			qualifiedLeads,
			hotLeads,
			convertedLeads,
			newLeads,
			totalOpportunities,
			totalValue,
			conversionRate,
			leadsBySource,
			leadsByStatus,
			avgScore,
			leadsThisMonth,
			leadsThisWeek,
			leadsToday,
			avgLeadAge,
			recentActivity,
		};
	}, [leads, opportunities]);

	const tabs = [
		{ id: "overview", label: "Overview", icon: BarChart3 },
		{ id: "leads", label: "Leads Analysis", icon: Users },
		{ id: "opportunities", label: "Opportunities", icon: Target },
		{ id: "conversion", label: "Conversion", icon: TrendingUp },
		{ id: "timeline", label: "Timeline", icon: Calendar },
	];

	const renderOverview = () => (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
				<div className="hover-lift rounded-lg border border-border bg-card p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-muted-foreground text-sm">Total Leads</p>
							<p className="font-bold text-2xl text-foreground">
								{stats.totalLeads}
							</p>
							<div className="mt-1 flex items-center gap-1">
								<TrendingUp className="h-3 w-3 text-green-500" />
								<span className="text-green-600 text-xs dark:text-green-400">
									+
									{
										leads.filter((l) => {
											const leadDate = new Date(l.createdAt);
											const currentMonth = new Date();
											return (
												leadDate.getMonth() === currentMonth.getMonth() &&
												leadDate.getFullYear() === currentMonth.getFullYear()
											);
										}).length
									}{" "}
									this month
								</span>
							</div>
						</div>
						<Users className="h-8 w-8 text-primary" />
					</div>
				</div>

				<div className="hover-lift rounded-lg border border-border bg-card p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-muted-foreground text-sm">Conversion Rate</p>
							<p className="font-bold text-2xl text-foreground">
								{stats.conversionRate.toFixed(1)}%
							</p>
							<div className="mt-1 flex items-center gap-1">
								<TrendingUp className="h-3 w-3 text-green-500" />
								<span className="text-green-600 text-xs dark:text-green-400">
									{opportunities.length > 0
										? `${
												opportunities.filter((opp) => {
													const oppDate = new Date(opp.convertedAt);
													const currentMonth = new Date();
													return (
														oppDate.getMonth() === currentMonth.getMonth() &&
														oppDate.getFullYear() === currentMonth.getFullYear()
													);
												}).length
											} converted this month`
										: "No conversions yet"}
								</span>
							</div>
						</div>
						<TrendingUp className="h-8 w-8 text-green-500" />
					</div>
				</div>

				<div className="hover-lift rounded-lg border border-border bg-card p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-muted-foreground text-sm">Pipeline Value</p>
							<p className="font-bold text-2xl text-foreground">
								${stats.totalValue.toLocaleString()}
							</p>
						</div>
						<Target className="h-8 w-8 text-blue-500" />
					</div>
				</div>

				<div className="hover-lift rounded-lg border border-border bg-card p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-muted-foreground text-sm">Avg Score</p>
							<p className="font-bold text-2xl text-foreground">
								{stats.avgScore.toFixed(0)}
							</p>
						</div>
						<Activity className="h-8 w-8 text-orange-500" />
					</div>
				</div>

				<div className="hover-lift rounded-lg border border-border bg-card p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-muted-foreground text-sm">This Week</p>
							<p className="font-bold text-2xl text-foreground">
								{stats.leadsThisWeek}
							</p>
						</div>
						<Calendar className="h-8 w-8 text-purple-500" />
					</div>
				</div>

				<div className="hover-lift rounded-lg border border-border bg-card p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-muted-foreground text-sm">Recent Activity</p>
							<p className="font-bold text-2xl text-foreground">
								{stats.recentActivity}
							</p>
						</div>
						<Clock className="h-8 w-8 text-indigo-500" />
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div className="rounded-lg border border-border bg-card p-6">
					<h3 className="mb-4 font-semibold text-foreground text-lg">
						Leads by Status
					</h3>
					<div className="space-y-3">
						{Object.entries(stats.leadsByStatus).map(([status, count]) => (
							<div key={status} className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm capitalize">
									{status}
								</span>
								<div className="flex items-center gap-2">
									<div className="h-2 w-24 rounded-full bg-muted">
										<div
											className="h-2 rounded-full bg-primary transition-all duration-300"
											style={{ width: `${(count / stats.totalLeads) * 100}%` }}
										/>
									</div>
									<span className="w-8 text-right font-medium text-foreground text-sm">
										{count}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="rounded-lg border border-border bg-card p-6">
					<h3 className="mb-4 font-semibold text-foreground text-lg">
						Leads by Source
					</h3>
					<div className="space-y-3">
						{Object.entries(stats.leadsBySource).map(([source, count]) => (
							<div key={source} className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">{source}</span>
								<div className="flex items-center gap-2">
									<div className="h-2 w-24 rounded-full bg-muted">
										<div
											className="h-2 rounded-full bg-blue-500 transition-all duration-300"
											style={{ width: `${(count / stats.totalLeads) * 100}%` }}
										/>
									</div>
									<span className="w-8 text-right font-medium text-foreground text-sm">
										{count}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);

	const renderTabContent = () => {
		switch (activeTab) {
			case "overview":
				return renderOverview();
			default:
				return renderOverview();
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="font-bold text-2xl text-foreground">
					Analytics & Insights
				</h2>
			</div>

			<div className="border-border border-b">
				<nav className="flex space-x-8">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						return (
							<button
								type="button"
								key={tab.id}
								onClick={() => setActiveTab(tab.id as TabType)}
								className={`flex items-center gap-2 border-b-2 px-1 py-2 font-medium text-sm transition-colors duration-200 ${
									activeTab === tab.id
										? "border-primary text-primary"
										: "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
								}`}
							>
								<Icon className="h-4 w-4" />
								{tab.label}
							</button>
						);
					})}
				</nav>
			</div>

			<div className="min-h-[600px]">
				{loading ? (
					<div className="space-y-6">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
							{["a", "b", "c", "d"].map((seed) => (
								<div
									key={`overview-skel-${seed}`}
									className="rounded-lg border border-border bg-card p-4"
								>
									<div className="flex items-center justify-between">
										<div className="space-y-2">
											<Skeleton className="h-4 w-20" />
											<Skeleton className="h-8 w-16" />
										</div>
										<Skeleton className="h-8 w-8 rounded" />
									</div>
								</div>
							))}
						</div>
					</div>
				) : (
					renderTabContent()
				)}
			</div>
		</div>
	);
}
