import type { Opportunity, CreateOpportunityRequest } from "@/domain/models";
import type { OpportunityRepository } from "@/domain/repositories/opportunity-repository";

export class OpportunityUseCases {
	private opportunityRepository: OpportunityRepository;

	constructor(opportunityRepository: OpportunityRepository) {
		this.opportunityRepository = opportunityRepository;
	}

	async getAllOpportunities(): Promise<Opportunity[]> {
		return this.opportunityRepository.getAll();
	}

	async getOpportunityById(id: string): Promise<Opportunity | null> {
		if (!id.trim()) {
			throw new Error("Opportunity ID is required");
		}
		return this.opportunityRepository.getById(id);
	}

	async createOpportunity(
		data: CreateOpportunityRequest,
	): Promise<Opportunity> {
		this.validateOpportunityData(data);
		return this.opportunityRepository.create(data);
	}

	async updateOpportunity(
		id: string,
		data: Partial<Opportunity>,
	): Promise<Opportunity> {
		if (!id.trim()) {
			throw new Error("Opportunity ID is required");
		}

		if (Object.keys(data).length === 0) {
			throw new Error("No update data provided");
		}

		this.validateOpportunityUpdateData(data);
		return this.opportunityRepository.update(id, data);
	}

	async deleteOpportunity(id: string): Promise<void> {
		if (!id.trim()) {
			throw new Error("Opportunity ID is required");
		}
		await this.opportunityRepository.delete(id);
	}

	private validateOpportunityData(data: CreateOpportunityRequest): void {
		if (!data.name?.trim()) {
			throw new Error("Opportunity name is required");
		}
		if (!data.accountName?.trim()) {
			throw new Error("Account name is required");
		}
		if (!data.convertedFrom?.trim()) {
			throw new Error("Converted from lead ID is required");
		}
		if (data.amount !== undefined && data.amount <= 0) {
			throw new Error("Amount must be greater than 0");
		}
	}

	private validateOpportunityUpdateData(data: Partial<Opportunity>): void {
		if (data.name !== undefined && !data.name.trim()) {
			throw new Error("Opportunity name cannot be empty");
		}
		if (data.accountName !== undefined && !data.accountName.trim()) {
			throw new Error("Account name cannot be empty");
		}
		if (data.amount !== undefined && data.amount <= 0) {
			throw new Error("Amount must be greater than 0");
		}
	}
}
