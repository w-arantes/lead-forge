import type { LeadSource, LeadStatus } from "./constants";

export interface Lead {
	id: string;
	name: string;
	company: string;
	email: string;
	source: LeadSource;
	score: number;
	status: LeadStatus;
	createdAt: string; // ISO date string
	lastContacted?: string; // ISO date string
	convertedAt?: string; // ISO date string when converted
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
	createdAt?: string; // Optional, will be set automatically if not provided
}

export interface UpdateLeadRequest {
	name?: string;
	company?: string;
	email?: string;
	source?: LeadSource;
	score?: number;
	status?: LeadStatus;
}
