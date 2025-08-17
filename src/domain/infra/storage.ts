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
};
