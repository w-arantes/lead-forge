import { z } from "zod";

import {
	ConvertToOpportunitySchema,
	LeadFormSchema,
	LeadUpdateSchema,
	OpportunityFormSchema,
	OpportunityUpdateSchema,
} from "@/domain/schemas";

export const ApiResponseSchema = z.object({
	success: z.boolean(),
	message: z.string().optional(),
	data: z.unknown().optional(),
	error: z.string().optional(),
	meta: z
		.object({
			timestamp: z.iso.datetime(),
			requestId: z.string().uuid().optional(),
			version: z.string().optional(),
		})
		.optional(),
});

export const PaginationMetaSchema = z.object({
	page: z.number().int().min(1),
	limit: z.number().int().min(1).max(100),
	total: z.number().int().min(0),
	totalPages: z.number().int().min(0),
	hasNext: z.boolean(),
	hasPrev: z.boolean(),
});

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(
	dataSchema: T,
) =>
	z.object({
		success: z.boolean(),
		data: z.array(dataSchema),
		meta: PaginationMetaSchema,
		message: z.string().optional(),
	});

export const CreateLeadRequestSchema = LeadFormSchema;
export const CreateLeadResponseSchema = ApiResponseSchema.extend({
	data: z.object({
		id: z.string().uuid(),
		...LeadFormSchema.shape,
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
});

export const UpdateLeadRequestSchema = LeadUpdateSchema;
export const UpdateLeadResponseSchema = ApiResponseSchema.extend({
	data: z.object({
		id: z.string().uuid(),
		...LeadUpdateSchema.shape,
		updatedAt: z.iso.datetime(),
	}),
});

export const GetLeadRequestSchema = z.object({
	id: z.string().uuid("Invalid lead ID format"),
});

export const GetLeadResponseSchema = ApiResponseSchema.extend({
	data: z.object({
		id: z.string().uuid(),
		name: z.string(),
		company: z.string(),
		email: z.string().email(),
		source: z.string(),
		score: z.number().int().min(0).max(100),
		status: z.string(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
});

export const GetLeadsRequestSchema = z.object({
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
	search: z.string().trim().optional(),
	status: z.string().optional(),
	source: z.string().optional(),
	minScore: z.number().int().min(0).max(100).optional(),
	maxScore: z.number().int().min(0).max(100).optional(),
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

export const GetLeadsResponseSchema = PaginatedResponseSchema(
	z.object({
		id: z.string().uuid(),
		name: z.string(),
		company: z.string(),
		email: z.string().email(),
		source: z.string(),
		score: z.number().int().min(0).max(100),
		status: z.string(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

export const DeleteLeadRequestSchema = z.object({
	id: z.string().uuid("Invalid lead ID format"),
});

export const DeleteLeadResponseSchema = ApiResponseSchema.extend({
	data: z.object({
		deleted: z.boolean(),
		id: z.string().uuid(),
	}),
});

export const CreateOpportunityRequestSchema = OpportunityFormSchema;
export const CreateOpportunityResponseSchema = ApiResponseSchema.extend({
	data: z.object({
		id: z.uuid(),
		...OpportunityFormSchema.shape,
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
});

export const UpdateOpportunityRequestSchema = OpportunityUpdateSchema;
export const UpdateOpportunityResponseSchema = ApiResponseSchema.extend({
	data: z.object({
		id: z.uuid(),
		...OpportunityUpdateSchema.shape,
		updatedAt: z.iso.datetime(),
	}),
});

export const GetOpportunityRequestSchema = z.object({
	id: z.string().uuid("Invalid opportunity ID format"),
});

export const GetOpportunityResponseSchema = ApiResponseSchema.extend({
	data: z.object({
		id: z.uuid(),
		name: z.string(),
		stage: z.string(),
		amount: z.number().positive(),
		accountName: z.string(),
		convertedFrom: z.string().uuid(),
		convertedAt: z.iso.datetime(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
});

export const GetOpportunitiesRequestSchema = z.object({
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
	stage: z.string().optional(),
	minAmount: z.number().min(0).optional(),
	maxAmount: z.number().min(0).optional(),
	sortBy: z
		.enum(["name", "stage", "amount", "accountName", "createdAt"])
		.optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const GetOpportunitiesResponseSchema = PaginatedResponseSchema(
	z.object({
		id: z.uuid(),
		name: z.string(),
		stage: z.string(),
		amount: z.number().positive(),
		accountName: z.string(),
		convertedFrom: z.string().uuid(),
		convertedAt: z.iso.datetime(),
		createdAt: z.iso.datetime(),
		updatedAt: z.iso.datetime(),
	}),
);

export const DeleteOpportunityRequestSchema = z.object({
	id: z.string().uuid("Invalid opportunity ID format"),
});

export const DeleteOpportunityResponseSchema = ApiResponseSchema.extend({
	data: z.object({
		deleted: z.boolean(),
		id: z.uuid(),
	}),
});

export const ConvertLeadRequestSchema = ConvertToOpportunitySchema;
export const ConvertLeadResponseSchema = ApiResponseSchema.extend({
	data: z.object({
		opportunity: z.object({
			id: z.uuid(),
			name: z.string(),
			stage: z.string(),
			amount: z.number().positive(),
			accountName: z.string(),
			convertedFrom: z.string().uuid(),
			convertedAt: z.iso.datetime(),
			createdAt: z.iso.datetime(),
		}),
		lead: z.object({
			id: z.uuid(),
			status: z.string(),
			updatedAt: z.iso.datetime(),
		}),
	}),
});

export const GetAnalyticsRequestSchema = z.object({
	dateRange: z
		.object({
			start: z.iso.datetime().optional(),
			end: z.iso.datetime().optional(),
		})
		.optional(),
	groupBy: z.enum(["day", "week", "month", "quarter", "year"]).optional(),
});

export const GetAnalyticsResponseSchema = ApiResponseSchema.extend({
	data: z.object({
		leads: z.object({
			total: z.number().int().min(0),
			byStatus: z.record(z.string(), z.number().int().min(0)),
			bySource: z.record(z.string(), z.number().int().min(0)),
			conversionRate: z.number().min(0).max(100),
			avgScore: z.number().min(0).max(100),
			leadsThisWeek: z.number().int().min(0),
			recentActivity: z.number().int().min(0),
		}),
		opportunities: z.object({
			total: z.number().int().min(0),
			totalValue: z.number().min(0),
			byStage: z.record(z.string(), z.number().int().min(0)),
			avgAmount: z.number().min(0),
			conversionRate: z.number().min(0).max(100),
		}),
		trends: z.object({
			leadsGrowth: z.number(),
			opportunitiesGrowth: z.number(),
			revenueGrowth: z.number(),
		}),
	}),
});

export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

export type PaginatedResponse<T> = {
	success: boolean;
	data: T[];
	meta: PaginationMeta;
	message?: string;
};

export type CreateLeadRequest = z.infer<typeof CreateLeadRequestSchema>;
export type CreateLeadResponse = z.infer<typeof CreateLeadResponseSchema>;
export type UpdateLeadRequest = z.infer<typeof UpdateLeadRequestSchema>;
export type UpdateLeadResponse = z.infer<typeof UpdateLeadResponseSchema>;
export type GetLeadRequest = z.infer<typeof GetLeadRequestSchema>;
export type GetLeadResponse = z.infer<typeof GetLeadResponseSchema>;
export type GetLeadsRequest = z.infer<typeof GetLeadsRequestSchema>;
export type GetLeadsResponse = z.infer<typeof GetLeadsResponseSchema>;
export type DeleteLeadRequest = z.infer<typeof DeleteLeadRequestSchema>;
export type DeleteLeadResponse = z.infer<typeof DeleteLeadResponseSchema>;

export type CreateOpportunityRequest = z.infer<
	typeof CreateOpportunityRequestSchema
>;
export type CreateOpportunityResponse = z.infer<
	typeof CreateOpportunityResponseSchema
>;
export type UpdateOpportunityRequest = z.infer<
	typeof UpdateOpportunityRequestSchema
>;
export type UpdateOpportunityResponse = z.infer<
	typeof UpdateOpportunityResponseSchema
>;
export type GetOpportunityRequest = z.infer<typeof GetOpportunityRequestSchema>;
export type GetOpportunityResponse = z.infer<
	typeof GetOpportunityResponseSchema
>;
export type GetOpportunitiesRequest = z.infer<
	typeof GetOpportunitiesRequestSchema
>;
export type GetOpportunitiesResponse = z.infer<
	typeof GetOpportunitiesResponseSchema
>;
export type DeleteOpportunityRequest = z.infer<
	typeof DeleteOpportunityRequestSchema
>;
export type DeleteOpportunityResponse = z.infer<
	typeof DeleteOpportunityResponseSchema
>;

export type ConvertLeadRequest = z.infer<typeof ConvertLeadRequestSchema>;
export type ConvertLeadResponse = z.infer<typeof ConvertLeadResponseSchema>;

export type GetAnalyticsRequest = z.infer<typeof GetAnalyticsRequestSchema>;
export type GetAnalyticsResponse = z.infer<typeof GetAnalyticsResponseSchema>;
