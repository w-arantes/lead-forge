import type { Opportunity, CreateOpportunityRequest } from "@/domain/models";

export interface OpportunityRepository {
	getAll(): Promise<Opportunity[]>;
	getById(id: string): Promise<Opportunity | null>;
	create(data: CreateOpportunityRequest): Promise<Opportunity>;
	update(id: string, data: Partial<Opportunity>): Promise<Opportunity>;
	delete(id: string): Promise<void>;
}
