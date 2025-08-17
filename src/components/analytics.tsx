import {
	Activity,
	AlertCircle,
	ArrowRight,
	BarChart3,
	Calendar,
	CheckCircle,
	Clock,
	DollarSign,
	Target,
	TrendingUp,
	Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Kbd } from "@/components/ui/kbd";
import { Skeleton } from "@/components/ui/skeleton";
import { useShortcutsEnabled } from "@/domain/infra/store";
import type { Lead, Opportunity } from "@/domain/models";
import { LEAD_STATUSES, OPPORTUNITY_STAGES } from "@/domain/models/constants";
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
	| "pipeline"
	| "timeline";

export function Analytics({
	leads,
	opportunities,
	loading = false,
}: AnalyticsProps) {
	const [activeTab, setActiveTab] = useState<TabType>("overview");
	const shortcutsEnabled = useShortcutsEnabled();

	useEffect(() => {
		if (!shortcutsEnabled) return;

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey || e.metaKey) {
				switch (e.key) {
					case "1":
						e.preventDefault();
						setActiveTab("overview");
						break;
					case "2":
						e.preventDefault();
						setActiveTab("leads");
						break;
					case "3":
						e.preventDefault();
						setActiveTab("opportunities");
						break;
					case "4":
						e.preventDefault();
						setActiveTab("conversion");
						break;
					case "5":
						e.preventDefault();
						setActiveTab("pipeline");
						break;
					case "6":
						e.preventDefault();
						setActiveTab("timeline");
						break;
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [shortcutsEnabled]);

	const stats = useMemo(() => {
		const safeLeads = Array.isArray(leads) ? leads : [];
		const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];

		const totalLeads = safeLeads.length;
		const qualifiedLeads = safeLeads.filter(
			(l) => l.status === LEAD_STATUSES.QUALIFIED,
		).length;
		const hotLeads = safeLeads.filter(
			(l) => l.status === LEAD_STATUSES.HOT,
		).length;
		const newLeads = safeLeads.filter(
			(l) => l.status === LEAD_STATUSES.NEW,
		).length;

		const totalOpportunities = safeOpportunities.length;
		const totalValue = safeOpportunities.reduce(
			(sum, opp) => sum + (opp.amount || 0),
			0,
		);

		const conversionRate =
			totalLeads > 0 ? (totalOpportunities / totalLeads) * 100 : 0;

		const pipelineByStage = safeOpportunities.reduce(
			(acc, opp) => {
				acc[opp.stage] = (acc[opp.stage] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		const pipelineValueByStage = safeOpportunities.reduce(
			(acc, opp) => {
				acc[opp.stage] = (acc[opp.stage] || 0) + (opp.amount || 0);
				return acc;
			},
			{} as Record<string, number>,
		);

		const leadsBySource = safeLeads.reduce(
			(acc, lead) => {
				acc[lead.source] = (acc[lead.source] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		const leadsByStatus = safeLeads.reduce(
			(acc, lead) => {
				acc[lead.status] = (acc[lead.status] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>,
		);

		const avgScore =
			totalLeads > 0
				? safeLeads.reduce((sum, lead) => sum + lead.score, 0) / totalLeads
				: 0;

		const now = new Date();
		const leadsThisMonth = safeLeads.filter((l) =>
			dateUtils.isThisMonth(l.createdAt),
		).length;
		const leadsThisWeek = safeLeads.filter((l) =>
			dateUtils.isThisWeek(l.createdAt),
		).length;
		const leadsToday = safeLeads.filter((l) =>
			dateUtils.isToday(l.createdAt),
		).length;

		const opportunitiesThisMonth = safeOpportunities.filter((opp) =>
			dateUtils.isThisMonth(opp.convertedAt),
		).length;

		const avgLeadAge =
			totalLeads > 0
				? safeLeads.reduce(
						(sum, l) => sum + dateUtils.getDaysBetween(l.createdAt, now),
						0,
					) / totalLeads
				: 0;

		const recentActivity = safeLeads.filter(
			(l) => dateUtils.getDaysBetween(l.createdAt, now) <= 7,
		).length;

		const conversionFunnel = {
			totalLeads,
			qualifiedLeads,
			hotLeads,
			convertedToOpportunities: totalOpportunities,
			conversionRate,
		};

		return {
			totalLeads,
			qualifiedLeads,
			hotLeads,
			newLeads,
			totalOpportunities,
			totalValue,
			conversionRate,
			leadsBySource,
			leadsByStatus,
			pipelineByStage,
			pipelineValueByStage,
			avgScore,
			leadsThisMonth,
			leadsThisWeek,
			leadsToday,
			opportunitiesThisMonth,
			avgLeadAge,
			recentActivity,
			conversionFunnel,
		};
	}, [leads, opportunities]);

	const tabs = [
		{ id: "overview", label: "Overview", icon: BarChart3 },
		{ id: "leads", label: "Leads Analysis", icon: Users },
		{ id: "opportunities", label: "Opportunities", icon: Target },
		{ id: "conversion", label: "Conversion", icon: TrendingUp },
		{ id: "pipeline", label: "Pipeline", icon: DollarSign },
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
									+{stats.leadsThisMonth} this month
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
									{stats.opportunitiesThisMonth} converted this month
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
							<div className="mt-1 flex items-center gap-1">
								<Target className="h-3 w-3 text-blue-500" />
								<span className="text-blue-600 text-xs dark:text-blue-400">
									{stats.totalOpportunities} opportunities
								</span>
							</div>
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
							<div className="mt-1 flex items-center gap-1">
								<Activity className="h-3 w-3 text-orange-500" />
								<span className="text-orange-600 text-xs dark:text-orange-400">
									{stats.hotLeads} hot leads
								</span>
							</div>
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
							<div className="mt-1 flex items-center gap-1">
								<Calendar className="h-3 w-3 text-purple-500" />
								<span className="text-purple-600 text-xs dark:text-purple-400">
									{stats.leadsToday} today
								</span>
							</div>
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
							<div className="mt-1 flex items-center gap-1">
								<Clock className="h-3 w-3 text-indigo-500" />
								<span className="text-indigo-600 text-xs dark:text-indigo-400">
									last 7 days
								</span>
							</div>
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

	const renderPipeline = () => (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div className="rounded-lg border border-border bg-card p-6">
					<h3 className="mb-4 font-semibold text-foreground text-lg">
						Pipeline by Stage
					</h3>
					<div className="space-y-4">
						{Object.entries(OPPORTUNITY_STAGES).map(([, stage]) => {
							const count = stats.pipelineByStage[stage] || 0;
							const value = stats.pipelineValueByStage[stage] || 0;
							const percentage =
								stats.totalOpportunities > 0
									? (count / stats.totalOpportunities) * 100
									: 0;

							return (
								<div key={stage} className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-muted-foreground text-sm capitalize">
											{stage}
										</span>
										<div className="flex items-center gap-2">
											<span className="font-medium text-foreground text-sm">
												{count}
											</span>
											<span className="text-muted-foreground text-xs">
												({percentage.toFixed(1)}%)
											</span>
										</div>
									</div>
									<div className="h-2 w-full rounded-full bg-muted">
										<div
											className="h-2 rounded-full bg-blue-500 transition-all duration-300"
											style={{ width: `${percentage}%` }}
										/>
									</div>
									{value > 0 && (
										<p className="text-muted-foreground text-xs">
											${value.toLocaleString()} value
										</p>
									)}
								</div>
							);
						})}
					</div>
				</div>

				<div className="rounded-lg border border-border bg-card p-6">
					<h3 className="mb-4 font-semibold text-foreground text-lg">
						Conversion Funnel
					</h3>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Users className="h-4 w-4 text-blue-500" />
								<span className="text-sm">Total Leads</span>
							</div>
							<span className="font-medium">{stats.totalLeads}</span>
						</div>

						<ArrowRight className="mx-auto h-4 w-4 text-muted-foreground" />

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<CheckCircle className="h-4 w-4 text-green-500" />
								<span className="text-sm">Qualified</span>
							</div>
							<span className="font-medium">{stats.qualifiedLeads}</span>
						</div>

						<ArrowRight className="mx-auto h-4 w-4 text-muted-foreground" />

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<AlertCircle className="h-4 w-4 text-orange-500" />
								<span className="text-sm">Hot</span>
							</div>
							<span className="font-medium">{stats.hotLeads}</span>
						</div>

						<ArrowRight className="mx-auto h-4 w-4 text-muted-foreground" />

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<Target className="h-4 w-4 text-purple-500" />
								<span className="text-sm">Converted</span>
							</div>
							<span className="font-medium">{stats.totalOpportunities}</span>
						</div>

						<div className="mt-4 border-border border-t pt-4">
							<div className="flex items-center justify-between">
								<span className="font-medium text-sm">Conversion Rate</span>
								<span className="font-bold text-green-600 text-lg">
									{stats.conversionRate.toFixed(1)}%
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderLeadsAnalysis = () => (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div className="rounded-lg border border-border bg-card p-6">
					<h3 className="mb-4 font-semibold text-foreground text-lg">
						Leads by Source
					</h3>
					<div className="space-y-3">
						{Object.entries(stats.leadsBySource).map(([source, count]) => (
							<div key={source} className="flex items-center justify-between">
								<span className="text-foreground">{source}</span>
								<span className="font-medium text-foreground">{count}</span>
							</div>
						))}
					</div>
				</div>
				<div className="rounded-lg border border-border bg-card p-6">
					<h3 className="mb-4 font-semibold text-foreground text-lg">
						Leads by Status
					</h3>
					<div className="space-y-3">
						{Object.entries(stats.leadsByStatus).map(([status, count]) => (
							<div key={status} className="flex items-center justify-between">
								<span className="text-foreground">{status}</span>
								<span className="font-medium text-foreground">{count}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);

	const renderOpportunitiesAnalysis = () => (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div className="rounded-lg border border-border bg-card p-6">
					<h3 className="mb-4 font-semibold text-foreground text-lg">
						Pipeline by Stage
					</h3>
					<div className="space-y-3">
						{Object.entries(stats.pipelineByStage).map(([stage, count]) => (
							<div key={stage} className="flex items-center justify-between">
								<span className="text-foreground">{stage}</span>
								<span className="font-medium text-foreground">{count}</span>
							</div>
						))}
					</div>
				</div>
				<div className="rounded-lg border border-border bg-card p-6">
					<h3 className="mb-4 font-semibold text-foreground text-lg">
						Pipeline Value by Stage
					</h3>
					<div className="space-y-3">
						{Object.entries(stats.pipelineValueByStage).map(
							([stage, value]) => (
								<div key={stage} className="flex items-center justify-between">
									<span className="text-foreground">{stage}</span>
									<span className="font-medium text-green-600">
										${value.toLocaleString()}
									</span>
								</div>
							),
						)}
					</div>
				</div>
			</div>
		</div>
	);

	const renderConversionAnalysis = () => (
		<div className="space-y-6">
			<div className="rounded-lg border border-border bg-card p-6">
				<h3 className="mb-4 font-semibold text-foreground text-lg">
					Conversion Funnel
				</h3>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-foreground">Total Leads</span>
						<span className="font-medium text-foreground">
							{stats.totalLeads}
						</span>
					</div>
					<ArrowRight className="mx-auto h-4 w-4 text-muted-foreground" />
					<div className="flex items-center justify-between">
						<span className="text-foreground">Qualified</span>
						<span className="font-medium text-foreground">
							{stats.qualifiedLeads}
						</span>
					</div>
					<ArrowRight className="mx-auto h-4 w-4 text-muted-foreground" />
					<div className="flex items-center justify-between">
						<span className="text-foreground">Hot</span>
						<span className="font-medium text-foreground">
							{stats.hotLeads}
						</span>
					</div>
					<ArrowRight className="mx-auto h-4 w-4 text-muted-foreground" />
					<div className="flex items-center justify-between">
						<span className="text-foreground">Converted</span>
						<span className="font-medium text-foreground">
							{stats.totalOpportunities}
						</span>
					</div>
					<div className="mt-4 border-border border-t pt-4">
						<div className="flex items-center justify-between">
							<span className="font-medium text-foreground text-sm">
								Conversion Rate
							</span>
							<span className="font-bold text-green-600 text-lg">
								{stats.conversionRate.toFixed(1)}%
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderTimeline = () => (
		<div className="space-y-6">
			<div className="rounded-lg border border-border bg-card p-6">
				<h3 className="mb-4 font-semibold text-foreground text-lg">
					Recent Activity
				</h3>
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<Clock className="h-4 w-4 text-muted-foreground" />
						<div>
							<p className="text-foreground text-sm">
								{stats.leadsThisMonth} leads added this month
							</p>
							<p className="text-muted-foreground text-xs">
								{stats.leadsThisWeek} this week, {stats.leadsToday} today
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<Target className="h-4 w-4 text-muted-foreground" />
						<div>
							<p className="text-foreground text-sm">
								{stats.opportunitiesThisMonth} opportunities created this month
							</p>
							<p className="text-foreground text-xs">
								Pipeline value: ${stats.totalValue.toLocaleString()}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<TrendingUp className="h-4 w-4 text-muted-foreground" />
						<div>
							<p className="text-foreground text-sm">
								Average lead score: {stats.avgScore.toFixed(0)}
							</p>
							<p className="text-foreground text-xs">
								{stats.hotLeads} hot leads, {stats.qualifiedLeads} qualified
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const renderTabContent = () => {
		switch (activeTab) {
			case "overview":
				return renderOverview();
			case "leads":
				return renderLeadsAnalysis();
			case "opportunities":
				return renderOpportunitiesAnalysis();
			case "conversion":
				return renderConversionAnalysis();
			case "pipeline":
				return renderPipeline();
			case "timeline":
				return renderTimeline();
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
				{shortcutsEnabled && (
					<div className="flex items-center justify-between px-6 py-2">
						<div className="text-muted-foreground text-xs">
							Use <Kbd>Ctrl</Kbd> + <Kbd>1-6</Kbd> to navigate tabs
						</div>
					</div>
				)}
				<div className="relative">
					<div className="scrollbar-hide flex overflow-x-auto">
						<nav className="flex min-w-full space-x-1 px-1 py-2 sm:space-x-2 md:space-x-4 lg:space-x-8">
							{tabs.map((tab, index) => {
								const Icon = tab.icon;
								return (
									<button
										type="button"
										key={tab.id}
										onClick={() => setActiveTab(tab.id as TabType)}
										className={`flex shrink-0 cursor-pointer items-center gap-1 border-b-2 px-2 py-2 font-medium text-sm transition-colors duration-200 sm:gap-2 sm:px-3 ${
											activeTab === tab.id
												? "border-primary text-primary"
												: "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
										}`}
									>
										<Icon className="h-4 w-4" />
										<span className="hidden sm:inline">{tab.label}</span>
										<span className="sm:hidden">{tab.label.split(" ")[0]}</span>
										{shortcutsEnabled && (
											<span className="hidden lg:inline">
												<Kbd className="ml-1 text-xs">{index + 1}</Kbd>
											</span>
										)}
									</button>
								);
							})}
						</nav>
					</div>
				</div>
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
