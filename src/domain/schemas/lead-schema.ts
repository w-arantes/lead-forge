import { z } from "zod";
import { LEAD_SOURCES, LEAD_STATUSES } from "@/domain/models";

export type LeadSource = (typeof LEAD_SOURCES)[keyof typeof LEAD_SOURCES];
export type LeadStatusLite = Exclude<
	(typeof LEAD_STATUSES)[keyof typeof LEAD_STATUSES],
	"Converted"
>;

export interface LeadFormData {
	name: string;
	company: string;
	email: string;
	source: LeadSource;
	score: number;
	status: LeadStatusLite;
	createdAt?: string;
}

export const leadSources = Object.values(LEAD_SOURCES);
export const leadStatuses = Object.values(LEAD_STATUSES).filter(
	(status) => status !== LEAD_STATUSES.CONVERTED,
);

export const leadFormDefaults: LeadFormData = {
	name: "",
	company: "",
	email: "",
	source: LEAD_SOURCES.WEBSITE,
	score: 50,
	status: LEAD_STATUSES.NEW,
};

export const LeadFormSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name cannot exceed 100 characters")
		.regex(
			/^[a-zA-Z\s\-'.]+$/,
			"Name can only contain letters, spaces, hyphens, apostrophes, and periods",
		),
	company: z
		.string()
		.trim()
		.min(2, "Company must be at least 2 characters")
		.max(100, "Company cannot exceed 100 characters")
		.regex(
			/^[a-zA-Z0-9\s\-'.&]+$/,
			"Company can only contain letters, numbers, spaces, hyphens, apostrophes, periods, and ampersands",
		),
	email: z
		.string()
		.trim()
		.min(1, "Email is required")
		.max(254, "Email cannot exceed 254 characters")
		.email("Please enter a valid email address")
		.toLowerCase(),
	source: z.enum(leadSources as [string, ...string[]], {
		message: "Please select a valid lead source",
	}),
	score: z
		.number()
		.int("Score must be a whole number")
		.min(0, "Score must be at least 0")
		.max(100, "Score cannot exceed 100"),
	status: z.enum(leadStatuses as [string, ...string[]], {
		message: "Please select a valid status",
	}),
	createdAt: z.string().datetime().optional(),
});

export const LeadUpdateSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name cannot exceed 100 characters")
		.regex(
			/^[a-zA-Z\s\-'.]+$/,
			"Name can only contain letters, spaces, hyphens, apostrophes, and periods",
		)
		.optional(),
	company: z
		.string()
		.trim()
		.min(2, "Company must be at least 2 characters")
		.max(100, "Company cannot exceed 100 characters")
		.regex(
			/^[a-zA-Z0-9\s\-'.&]+$/,
			"Company can only contain letters, numbers, spaces, hyphens, apostrophes, periods, and ampersands",
		)
		.optional(),
	email: z
		.string()
		.trim()
		.min(1, "Email is required")
		.max(254, "Email cannot exceed 254 characters")
		.email("Please enter a valid email address")
		.toLowerCase(),
	status: z.enum(Object.values(LEAD_STATUSES) as [string, ...string[]], {
		message: "Please select a valid status",
	}),
	score: z
		.number()
		.int("Score must be a whole number")
		.min(0, "Score must be at least 0")
		.max(100, "Score cannot exceed 100")
		.optional(),
	source: z
		.enum(leadSources as [string, ...string[]], {
			message: "Please select a valid lead source",
		})
		.optional(),
});

export const ConvertToOpportunitySchema = z.object({
	amount: z
		.string()
		.trim()
		.min(1, "Amount is required")
		.regex(
			/^\d+(\.\d{1,2})?$/,
			"Amount must be a valid number with up to 2 decimal places",
		)
		.refine((v) => Number(v) > 0, {
			message: "Amount must be greater than 0",
		})
		.refine((v) => Number(v) <= 999999999.99, {
			message: "Amount cannot exceed 999,999,999.99",
		}),
});

export const validateLeadForm = (
	data: LeadFormData,
): { isValid: boolean; errors: Record<string, string> } => {
	try {
		LeadFormSchema.parse(data);
		return { isValid: true, errors: {} };
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errors: Record<string, string> = {};
			error.issues.forEach((issue) => {
				const field = issue.path[0] as string;
				errors[field] = issue.message;
			});
			return { isValid: false, errors };
		}
		return { isValid: false, errors: { general: "Validation failed" } };
	}
};

export type LeadFormInput = z.infer<typeof LeadFormSchema>;
export type LeadUpdateInput = z.infer<typeof LeadUpdateSchema>;
export type ConvertToOpportunityInput = z.infer<
	typeof ConvertToOpportunitySchema
>;
