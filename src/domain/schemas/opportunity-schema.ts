import { z } from "zod";
import { OPPORTUNITY_STAGES } from "@/domain/models";

export const opportunityStages = Object.values(OPPORTUNITY_STAGES);

export const OpportunityFormSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Opportunity name must be at least 2 characters")
		.max(100, "Opportunity name cannot exceed 100 characters")
		.regex(
			/^[a-zA-Z0-9\s\-'\.&]+$/,
			"Name can only contain letters, numbers, spaces, hyphens, apostrophes, periods, and ampersands",
		),
	stage: z.enum(opportunityStages as [string, ...string[]], {
		message: "Please select a valid stage",
	}),
	amount: z
		.number()
		.min(0.01, "Amount must be greater than 0")
		.max(999999999.99, "Amount cannot exceed 999,999,999.99")
		.refine((val) => Number.isFinite(val), "Amount must be a valid number"),
	accountName: z
		.string()
		.trim()
		.min(2, "Account name must be at least 2 characters")
		.max(100, "Account name cannot exceed 100 characters")
		.regex(
			/^[a-zA-Z0-9\s\-'\.&]+$/,
			"Account name can only contain letters, numbers, spaces, hyphens, apostrophes, periods, and ampersands",
		),
	convertedFrom: z
		.string()
		.min(1, "Lead ID is required")
		.uuid("Invalid lead ID format"),
	convertedAt: z
		.string()
		.datetime("Invalid date format")
		.refine(
			(date) => new Date(date) <= new Date(),
			"Conversion date cannot be in the future",
		),
});

export const OpportunityUpdateSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Opportunity name must be at least 2 characters")
		.max(100, "Opportunity name cannot exceed 100 characters")
		.regex(
			/^[a-zA-Z0-9\s\-'\.&]+$/,
			"Name can only contain letters, numbers, spaces, hyphens, apostrophes, periods, and ampersands",
		)
		.optional(),
	stage: z
		.enum(opportunityStages as [string, ...string[]], {
			message: "Please select a valid stage",
		})
		.optional(),
	amount: z
		.number()
		.min(0.01, "Amount must be greater than 0")
		.max(999999999.99, "Amount cannot exceed 999,999,999.99")
		.refine((val) => Number.isFinite(val), "Amount must be a valid number")
		.optional(),
	accountName: z
		.string()
		.trim()
		.min(2, "Account name must be at least 2 characters")
		.max(100, "Account name cannot exceed 100 characters")
		.regex(
			/^[a-zA-Z0-9\s\-'\.&]+$/,
			"Account name can only contain letters, numbers, spaces, hyphens, apostrophes, periods, and ampersands",
		)
		.optional(),
});

export const OpportunityFilterSchema = z.object({
	stage: z.enum(opportunityStages as [string, ...string[]]).optional(),
	minAmount: z.number().min(0, "Minimum amount cannot be negative").optional(),
	maxAmount: z.number().min(0, "Maximum amount cannot be negative").optional(),
	dateRange: z
		.object({
			start: z.iso.datetime().optional(),
			end: z.iso.datetime().optional(),
		})
		.optional(),
});

export type OpportunityFormInput = z.infer<typeof OpportunityFormSchema>;
export type OpportunityUpdateInput = z.infer<typeof OpportunityUpdateSchema>;
export type OpportunityFilterInput = z.infer<typeof OpportunityFilterSchema>;
