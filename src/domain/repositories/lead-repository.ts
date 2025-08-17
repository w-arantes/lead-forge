import type {
	CreateLeadRequest,
	Lead,
	UpdateLeadRequest,
} from "@/domain/models";

export interface LeadRepository {
	getAll(): Promise<Lead[]>;
	getById(id: string): Promise<Lead | null>;
	create(data: CreateLeadRequest): Promise<Lead>;
	update(id: string, data: UpdateLeadRequest): Promise<Lead>;
	delete(id: string): Promise<void>;
	convertToOpportunity(id: string, amount?: number): Promise<Lead>;
}
