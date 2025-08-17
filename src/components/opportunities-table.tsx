import { Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OpportunitiesTableSkeleton } from "@/components/ui/table-skeleton";
import type { Lead, Opportunity } from "@/domain/models";
import { dateUtils } from "@/helpers/date";

interface OpportunitiesTableProps {
	opportunities: Opportunity[];
	loading?: boolean;
	leads: Lead[];
	onLeadSelect: (lead: Lead) => void;
	onExport?: () => void;
}

export function OpportunitiesTable({
	opportunities,
	loading = false,
	leads,
	onLeadSelect,
	onExport,
}: OpportunitiesTableProps) {
	const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];
	const safeLeads = Array.isArray(leads) ? leads : [];

	if (loading) {
		return <OpportunitiesTableSkeleton />;
	}

	if (safeOpportunities.length === 0) {
		return (
			<div className="py-12 text-center">
				<p className="text-muted-foreground">
					No opportunities yet. Convert some leads to get started!
				</p>
			</div>
		);
	}

	const getStageColor = (stage: string) => {
		switch (stage) {
			case "Closed Won":
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
			case "Closed Lost":
				return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
			case "Negotiation":
				return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
			case "Proposal":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
			case "Qualification":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="font-medium text-foreground text-lg">Opportunities</h2>
					<span className="text-muted-foreground text-sm">
						{safeOpportunities.length} total
					</span>
				</div>
				{onExport && (
					<Button
						type="button"
						onClick={onExport}
						variant="outline"
						size="sm"
						className="gap-2"
					>
						<Download className="h-4 w-4" />
						Export
					</Button>
				)}
			</div>

			<div className="overflow-x-auto rounded-lg border">
				<table className="w-full min-w-[760px]">
					<thead className="bg-muted/50">
						<tr>
							<th className="px-4 py-3 text-left font-medium text-sm">Name</th>
							<th className="px-4 py-3 text-left font-medium text-sm">
								Account
							</th>
							<th className="px-4 py-3 text-left font-medium text-sm">Stage</th>
							<th className="px-4 py-3 text-left font-medium text-sm">
								Amount
							</th>
							<th className="px-4 py-3 text-left font-medium text-sm">
								Converted
							</th>
							<th className="px-4 py-3 text-left font-medium text-sm">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{safeOpportunities.map((opportunity, index) => (
							<tr
								key={opportunity.id}
								className="hover-lift hover-scale border-t hover:bg-muted/30"
								style={{
									animationDelay: `${index * 50}ms`,
									animation: "fadeInUp 0.3s ease-out forwards",
								}}
							>
								<td className="px-4 py-3">
									<div className="font-medium text-foreground">
										{opportunity.name}
									</div>
								</td>
								<td className="px-4 py-3 text-foreground">
									{opportunity.accountName}
								</td>
								<td className="px-4 py-3">
									<span
										className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${getStageColor(opportunity.stage)}`}
									>
										{opportunity.stage}
									</span>
								</td>
								<td className="px-4 py-3">
									{opportunity.amount ? (
										<span className="font-medium text-green-600">
											${opportunity.amount.toLocaleString()}
										</span>
									) : (
										<span className="text-muted-foreground">-</span>
									)}
								</td>
								<td className="px-4 py-3 text-muted-foreground text-sm">
									{dateUtils.formatDate(opportunity.convertedAt)}
								</td>
								<td className="px-4 py-3">
									<div className="flex items-center gap-2">
										{opportunity.convertedFrom && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => {
													const originalLead = safeLeads.find(
														(l) => l.id === opportunity.convertedFrom,
													);
													if (originalLead) {
														onLeadSelect(originalLead);
													}
												}}
												className="h-8 cursor-pointer px-2 text-xs transition-colors hover:bg-primary/10 hover:text-primary"
												aria-label="View original lead details"
											>
												<Eye className="mr-1 h-3 w-3" />
												Lead
											</Button>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
