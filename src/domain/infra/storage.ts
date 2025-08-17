import { STORAGE_KEYS } from "@/constants/storage";
import type { Lead, LeadFilters, Opportunity } from "@/domain/models";

const CSV_HEADERS = {
	LEADS: [
		"ID",
		"Name",
		"Company",
		"Email",
		"Source",
		"Score",
		"Status",
		"Created At",
		"Last Contacted",
	],
	OPPORTUNITIES: [
		"ID",
		"Name",
		"Stage",
		"Amount",
		"Account Name",
		"Converted From Lead",
		"Converted At",
	],
} as const;

interface StorageError extends Error {
	code: string;
	originalError?: unknown;
}

const createStorageError = (
	message: string,
	code: string,
	originalError?: unknown,
): StorageError => ({
	name: "StorageError",
	message,
	code,
	originalError,
});

const safeJsonParse = <T>(value: string | null, fallback: T): T => {
	if (!value) return fallback;

	try {
		return JSON.parse(value);
	} catch {
		return fallback;
	}
};

const safeJsonStringify = (value: unknown): string | null => {
	try {
		return JSON.stringify(value);
	} catch {
		return null;
	}
};

const safeLocalStorageSet = (key: string, value: unknown): void => {
	const serialized = safeJsonStringify(value);
	if (serialized) {
		localStorage.setItem(key, serialized);
	}
};

const safeLocalStorageGet = <T>(key: string, fallback: T): T => {
	try {
		const stored = localStorage.getItem(key);
		return safeJsonParse(stored, fallback);
	} catch {
		return fallback;
	}
};

const createCSVBlob = (
	headers: readonly string[],
	rows: (string | number)[][],
): Blob => {
	const csvContent = [headers, ...rows]
		.map((row) => row.map((field) => `"${field}"`).join(","))
		.join("\n");

	return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
};

const downloadBlob = (blob: Blob, filename: string): void => {
	const link = document.createElement("a");
	const url = URL.createObjectURL(blob);

	link.href = url;
	link.download = filename;
	link.style.visibility = "hidden";

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	URL.revokeObjectURL(url);
};

const getDefaultLeadFilters = (): LeadFilters => ({
	search: "",
	status: "",
	sortBy: "score",
	sortOrder: "desc",
});

const getDefaultLeads = (): Lead[] => [];
const getDefaultOpportunities = (): Opportunity[] => [];

export const storage = {
	getLeadFilters: (): LeadFilters => {
		return safeLocalStorageGet(
			STORAGE_KEYS.LEAD_FILTERS,
			getDefaultLeadFilters(),
		);
	},

	setLeadFilters: (filters: LeadFilters): void => {
		safeLocalStorageSet(STORAGE_KEYS.LEAD_FILTERS, filters);
	},

	getOpportunities: (): Opportunity[] => {
		return safeLocalStorageGet(
			STORAGE_KEYS.OPPORTUNITIES,
			getDefaultOpportunities(),
		);
	},

	setOpportunities: (opportunities: Opportunity[]): void => {
		safeLocalStorageSet(STORAGE_KEYS.OPPORTUNITIES, opportunities);
	},

	getLeads: (): Lead[] => {
		return safeLocalStorageGet(STORAGE_KEYS.LEADS, getDefaultLeads());
	},

	setLeads: (leads: Lead[]): void => {
		safeLocalStorageSet(STORAGE_KEYS.LEADS, leads);
	},

	exportLeadsToCSV: (leads: Lead[]): void => {
		if (!leads.length) {
			throw createStorageError("No leads to export", "EMPTY_DATA");
		}

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

		try {
			const blob = createCSVBlob(CSV_HEADERS.LEADS, rows);
			const filename = `leads_export_${new Date().toISOString().split("T")[0]}.csv`;
			downloadBlob(blob, filename);
		} catch (error) {
			throw createStorageError(
				"Failed to export leads to CSV",
				"EXPORT_FAILED",
				error,
			);
		}
	},

	exportOpportunitiesToCSV: (opportunities: Opportunity[]): void => {
		if (!opportunities.length) {
			throw createStorageError("No opportunities to export", "EMPTY_DATA");
		}

		const rows = opportunities.map((opp) => [
			opp.id,
			opp.name,
			opp.stage,
			opp.amount ? `$${opp.amount.toLocaleString()}` : "",
			opp.accountName || "",
			opp.convertedFrom || "",
			opp.convertedAt || "",
		]);

		try {
			const blob = createCSVBlob(CSV_HEADERS.OPPORTUNITIES, rows);
			const filename = `opportunities_export_${new Date().toISOString().split("T")[0]}.csv`;
			downloadBlob(blob, filename);
		} catch (error) {
			throw createStorageError(
				"Failed to export opportunities to CSV",
				"EXPORT_FAILED",
				error,
			);
		}
	},

	clearAll: (): void => {
		const keysToRemove = [
			STORAGE_KEYS.LEADS,
			STORAGE_KEYS.OPPORTUNITIES,
			STORAGE_KEYS.LEAD_FILTERS,
			STORAGE_KEYS.ZUSTAND_STORE,
		];

		keysToRemove.forEach((key) => {
			localStorage.removeItem(key);
		});
	},
};
