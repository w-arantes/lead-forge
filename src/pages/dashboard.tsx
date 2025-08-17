import { useId } from "react";
import { Header, DashboardTabs, ThemeToggle } from "@/components/layout";
import { Analytics } from "@/components/analytics";
import { AddLeadModal } from "@/components/add-lead-modal";
import { LeadDetailPanel } from "@/components/lead-detail-panel";
import { LeadsTable } from "@/components/leads-table";
import { OpportunitiesTable } from "@/components/opportunities-table";
import { StatsCards } from "@/components/stats-cards";
import { ToastContainer } from "@/components/ui/toast";

import {
	useAppActions,
	useActiveTab,
	useIsHeaderHidden,
	useLeads,
	useOpportunities,
} from "@/domain/infra/store";
import { getServices } from "@/domain/services/service-factory";

import type { Lead, Opportunity } from "@/domain/models";

import {
	useDataLoader,
	useFilterManager,
	useHeaderScroll,
	useModalManager,
	useToastManager,
} from "@/hooks";

export function Dashboard() {
	const tabsId = useId();

	useHeaderScroll();

	const activeTab = useActiveTab();
	const isHeaderHidden = useIsHeaderHidden();
	const { setActiveTab } = useAppActions();

	const { loading, error } = useDataLoader();
	const { filters, handleFiltersChange } = useFilterManager();
	const {
		selectedLead,
		isDetailPanelOpen,
		isAddLeadModalOpen,
		handleLeadSelect,
		handleDetailPanelClose,
		handleAddLeadModalClose,
	} = useModalManager();

	const { toasts, removeToast, showSuccessToast, showErrorToast } =
		useToastManager();

	// Get services directly from the service factory
	const services = getServices();
	const leadUseCases = services.getLeadUseCases();

	// Get data from store
	const leads = useLeads();
	const opportunities = useOpportunities();

	const safeLeads = Array.isArray(leads) ? leads : [];
	const safeOpportunities = Array.isArray(opportunities) ? opportunities : [];

	const handleLeadConvertWithToast = async (
		lead: Lead,
		amount?: number,
	): Promise<Opportunity> => {
		try {
			await leadUseCases.convertLeadToOpportunity(lead.id, amount);
			showSuccessToast(
				"Lead Converted",
				"Lead has been successfully converted to opportunity",
			);
			// Return a mock opportunity since the method returns the converted lead
			return {
				id: `opp_${Date.now()}`,
				name: lead.name,
				stage: "Prospecting",
				amount,
				accountName: lead.company,
				convertedFrom: lead.id,
				convertedAt: new Date().toISOString(),
			} as Opportunity;
		} catch (err) {
			showErrorToast(
				"Conversion Failed",
				err instanceof Error ? err.message : "Failed to convert lead",
			);
			throw err;
		}
	};

	const handleLeadUpdateWithToast = async (
		leadId: string,
		updates: Partial<Lead>,
	) => {
		try {
			await leadUseCases.updateLead(leadId, updates);
			showSuccessToast(
				"Lead Updated",
				"Lead information has been updated successfully",
			);
		} catch (err) {
			showErrorToast(
				"Update Failed",
				err instanceof Error ? err.message : "Failed to update lead",
			);
		}
	};

	const handleAddLeadWithToast = async (leadData: Omit<Lead, "id">) => {
		try {
			await leadUseCases.createLead(leadData);
			showSuccessToast("Lead Added", "New lead has been added successfully");
		} catch (err) {
			showErrorToast(
				"Add Failed",
				err instanceof Error ? err.message : "Failed to add lead",
			);
		}
	};

	if (error) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<div className="text-center">
					<h1 className="mb-4 font-bold text-2xl text-foreground">
						Something went wrong
					</h1>
					<p className="mb-6 text-muted-foreground">{error}</p>
					<button
						type="button"
						onClick={() => window.location.reload()}
						className="rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
					>
						Try again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen animate-fadeIn bg-background">
			<Header
				title="Lead Forge"
				rightSlot={<ThemeToggle />}
				isHidden={isHeaderHidden}
			/>

			<main className="mx-auto max-w-7xl px-4 pt-28 pb-12 sm:px-6 lg:px-8">
				{loading ? (
					<div className="flex items-center justify-center py-20">
						<div className="text-center">
							<div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
							<p className="text-muted-foreground">Loading dashboard data...</p>
						</div>
					</div>
				) : (
					<>
						<StatsCards
							leads={safeLeads}
							opportunities={safeOpportunities}
							loading={loading}
							onFilterChange={(filter) => handleFiltersChange(filter)}
							onExport={() => {}} // No export functionality in new structure
						/>

						<div className="mt-8 rounded-xl border bg-card">
							<DashboardTabs
								active={activeTab}
								onChange={(tab) => setActiveTab(tab)}
								idPrefix={tabsId}
							/>

							<div className="p-6">
								{activeTab === "leads" && (
									<div
										id={`${tabsId}-panel-leads`}
										role="tabpanel"
										aria-labelledby={`${tabsId}-tab-leads`}
										className="space-y-6"
									>
										<LeadsTable
											leads={safeLeads}
											onLeadSelect={handleLeadSelect}
											filters={filters}
											onFiltersChange={handleFiltersChange}
											loading={loading}
											onAddLead={handleAddLeadModalClose}
											onExport={() => {}} // No export functionality in new structure
										/>
									</div>
								)}

								{activeTab === "opportunities" && (
									<div
										id={`${tabsId}-panel-opportunities`}
										role="tabpanel"
										aria-labelledby={`${tabsId}-tab-opportunities`}
										className="space-y-6"
									>
										<OpportunitiesTable
											opportunities={safeOpportunities}
											loading={loading}
											leads={safeLeads}
											onLeadSelect={handleLeadSelect}
										/>
									</div>
								)}

								{activeTab === "analytics" && (
									<div
										id={`${tabsId}-panel-analytics`}
										role="tabpanel"
										aria-labelledby={`${tabsId}-tab-analytics`}
									>
										<Analytics
											leads={safeLeads}
											opportunities={safeOpportunities}
											loading={loading}
										/>
									</div>
								)}
							</div>
						</div>
					</>
				)}
			</main>

			<LeadDetailPanel
				lead={selectedLead}
				isOpen={isDetailPanelOpen}
				onClose={handleDetailPanelClose}
				onUpdate={handleLeadUpdateWithToast}
				onConvert={handleLeadConvertWithToast}
				opportunities={safeOpportunities}
			/>

			<AddLeadModal
				isOpen={isAddLeadModalOpen}
				onClose={handleAddLeadModalClose}
				onAdd={handleAddLeadWithToast}
			/>

			<ToastContainer toasts={toasts} onClose={removeToast} />
		</div>
	);
}
