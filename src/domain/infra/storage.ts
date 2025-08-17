import { STORAGE_KEYS } from "@/constants/storage";
import type { Lead, LeadFilters, Opportunity } from "@/domain/models";

export const storage = {
	getLeadFilters: (): LeadFilters => {
		try {
			const stored = localStorage.getItem(STORAGE_KEYS.LEAD_FILTERS);
			if (stored) {
				return JSON.parse(stored);
			}
		} catch {
			// swallow parse errors and fall back to defaults
		}

		return {
			search: "",
			status: "",
			sortBy: "score",
			sortOrder: "desc",
		};
	},

	setLeadFilters: (filters: LeadFilters): void => {
		try {
			localStorage.setItem(STORAGE_KEYS.LEAD_FILTERS, JSON.stringify(filters));
		} catch {
			// ignore persistence errors
		}
	},

	getOpportunities: (): Opportunity[] => {
		try {
			const stored = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
			if (stored) {
				return JSON.parse(stored);
			}
		} catch {
			// swallow parse errors and fall back to defaults
		}

		return [];
	},

	setOpportunities: (opportunities: Opportunity[]): void => {
		try {
			localStorage.setItem(
				STORAGE_KEYS.OPPORTUNITIES,
				JSON.stringify(opportunities),
			);
		} catch {
			// ignore persistence errors
		}
	},

	getLeads: (): Lead[] => {
		try {
			const stored = localStorage.getItem(STORAGE_KEYS.LEADS);
			if (stored) {
				return JSON.parse(stored);
			}
		} catch {
			// swallow parse errors and fall back to defaults
		}

		return [];
	},

	setLeads: (leads: Lead[]): void => {
		try {
			localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads));
		} catch {
			// ignore persistence errors
		}
	},

	exportLeadsToCSV: (leads: Lead[]): void => {
		try {
			const headers = [
				"ID",
				"Name",
				"Company",
				"Email",
				"Source",
				"Score",
				"Status",
				"Created At",
				"Last Contacted",
			];

			const rows = leads.map((lead) => [
				lead.id,
				lead.name,
				lead.company,
				lead.email,
				lead.source,
				lead.score.toString(),
				lead.status,
				lead.createdAt,
				lead.lastContacted || "",
			]);

			const csvContent = [headers, ...rows]
				.map((row) => row.map((field) => `"${field}"`).join(","))
				.join("\n");

			const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
			const link = document.createElement("a");
			const url = URL.createObjectURL(blob);

			link.setAttribute("href", url);
			link.setAttribute(
				"download",
				`leads_export_${new Date().toISOString().split("T")[0]}.csv`,
			);
			link.style.visibility = "hidden";

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Failed to export leads to CSV:", error);
			throw new Error("Export failed. Please try again.");
		}
	},

	exportOpportunitiesToCSV: (opportunities: Opportunity[]): void => {
		try {
			const headers = [
				"ID",
				"Name",
				"Stage",
				"Amount",
				"Account Name",
				"Converted From Lead",
				"Converted At",
			];

			const rows = opportunities.map((opp) => [
				opp.id,
				opp.name,
				opp.stage,
				opp.amount ? `$${opp.amount.toLocaleString()}` : "",
				opp.accountName || "",
				opp.convertedFrom || "",
				opp.convertedAt || "",
			]);

			const csvContent = [headers, ...rows]
				.map((row) => row.map((field) => `"${field}"`).join(","))
				.join("\n");

			const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
			const link = document.createElement("a");
			const url = URL.createObjectURL(blob);

			link.setAttribute("href", url);
			link.setAttribute(
				"download",
				`opportunities_export_${new Date().toISOString().split("T")[0]}.csv`,
			);
			link.style.visibility = "hidden";

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Failed to export opportunities to CSV:", error);
			throw new Error("Export failed. Please try again.");
		}
	},

	clearAll: (): void => {
		try {
			localStorage.removeItem(STORAGE_KEYS.LEADS);
			localStorage.removeItem(STORAGE_KEYS.OPPORTUNITIES);
			localStorage.removeItem(STORAGE_KEYS.LEAD_FILTERS);
			localStorage.removeItem(STORAGE_KEYS.ZUSTAND_STORE);
		} catch {
			// ignore clear errors
		}
	},
};
