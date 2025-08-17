import type { LeadSource, LeadStatus } from "./constants";

export interface Lead {
	id: string;
	name: string;
	company: string;
	email: string;
	source: LeadSource;
	score: number;
	status: LeadStatus;
	createdAt: string;
	lastContacted?: string;
	convertedAt?: string;
}

export interface LeadFilters {
	search: string;
	status: string;
	sortBy: "score" | "name" | "company";
	sortOrder: "asc" | "desc";
}

export interface CreateLeadRequest {
	name: string;
	company: string;
	email: string;
	source: LeadSource;
	score: number;
	status: LeadStatus;
	createdAt?: string;
}

export interface UpdateLeadRequest {
	name?: string;
	company?: string;
	email?: string;
	source?: LeadSource;
	score?: number;
	status?: LeadStatus;
}
