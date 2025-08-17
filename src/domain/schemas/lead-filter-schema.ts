import { z } from "zod";
import { LEAD_SOURCES, LEAD_STATUSES } from "@/domain/models";

const leadSources = Object.values(LEAD_SOURCES);
const leadStatuses = Object.values(LEAD_STATUSES);

export const LeadFilterSchema = z.object({
	search: z
		.string()
		.trim()
		.min(1, "Search term must be at least 1 character")
		.max(100, "Search term cannot exceed 100 characters")
		.optional(),
	status: z.enum(leadStatuses as [string, ...string[]]).optional(),
	source: z.enum(leadSources as [string, ...string[]]).optional(),
	minScore: z
		.number()
		.int("Score must be a whole number")
		.min(0, "Minimum score cannot be negative")
		.max(100, "Minimum score cannot exceed 100")
		.optional(),
	maxScore: z
		.number()
		.int("Score must be a whole number")
		.min(0, "Maximum score cannot be negative")
		.max(100, "Maximum score cannot exceed 100")
		.optional(),
	dateRange: z
		.object({
			start: z.string().datetime("Invalid start date format").optional(),
			end: z.string().datetime("Invalid end date format").optional(),
		})
		.optional(),
	company: z
		.string()
		.trim()
		.min(1, "Company filter must be at least 1 character")
		.max(100, "Company filter cannot exceed 100 characters")
		.optional(),
	page: z
		.number()
		.int("Page must be a whole number")
		.min(1, "Page must be at least 1")
		.optional(),
	limit: z
		.number()
		.int("Limit must be a whole number")
		.min(1, "Limit must be at least 1")
		.max(100, "Limit cannot exceed 100")
		.optional(),
	sortBy: z
		.enum([
			"name",
			"company",
			"email",
			"score",
			"status",
			"source",
			"createdAt",
		])
		.optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const LeadFilterDefaults = {
	page: 1,
	limit: 20,
	sortBy: "createdAt" as const,
	sortOrder: "desc" as const,
};

export type LeadFilterInput = z.infer<typeof LeadFilterSchema>;

/**
 * Helper function to validate and merge filter defaults
 */
export function createLeadFilter(
	filters: Partial<LeadFilterInput>,
): LeadFilterInput {
	const validatedFilters = LeadFilterSchema.parse(filters);
	return { ...LeadFilterDefaults, ...validatedFilters };
}

/**
 * Helper function to check if filters are empty (only contain defaults)
 */
export function isEmptyFilter(filters: LeadFilterInput): boolean {
	const {
		page: _,
		limit: __,
		sortBy: ___,
		sortOrder: ____,
		...otherFilters
	} = filters;
	const hasNonDefaultFilters = Object.values(otherFilters).some(
		(value) => value !== undefined && value !== null && value !== "",
	);
	return !hasNonDefaultFilters;
}
