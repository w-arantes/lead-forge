import type {
	CreateLeadRequest,
	Lead,
	UpdateLeadRequest,
} from "@/domain/models";
import { LEAD_STATUSES, OPPORTUNITY_STAGES } from "@/domain/models";
import type { LeadRepository } from "@/domain/repositories/lead-repository";
import type { OpportunityRepository } from "@/domain/repositories/opportunity-repository";

export class LeadUseCases {
	private leadRepository: LeadRepository;
	private opportunityRepository: OpportunityRepository;

	constructor(
		leadRepository: LeadRepository,
		opportunityRepository: OpportunityRepository,
	) {
		this.leadRepository = leadRepository;
		this.opportunityRepository = opportunityRepository;
	}

	async getAllLeads(): Promise<Lead[]> {
		return this.leadRepository.getAll();
	}

	async getLeadById(id: string): Promise<Lead | null> {
		if (!id.trim()) {
			throw new Error("Lead ID is required");
		}
		return this.leadRepository.getById(id);
	}

	async createLead(data: CreateLeadRequest): Promise<Lead> {
		this.validateLeadData(data);
		return this.leadRepository.create(data);
	}

	async updateLead(id: string, data: UpdateLeadRequest): Promise<Lead> {
		if (!id.trim()) {
			throw new Error("Lead ID is required");
		}

		if (Object.keys(data).length === 0) {
			throw new Error("No update data provided");
		}

		this.validateLeadUpdateData(data);
		return this.leadRepository.update(id, data);
	}

	async deleteLead(id: string): Promise<void> {
		if (!id.trim()) {
			throw new Error("Lead ID is required");
		}
		await this.leadRepository.delete(id);
	}

	async convertLeadToOpportunity(
		leadId: string,
		amount?: number,
	): Promise<Lead> {
		if (!leadId.trim()) {
			throw new Error("Lead ID is required");
		}

		const lead = await this.leadRepository.getById(leadId);
		if (!lead) {
			throw new Error("Lead not found");
		}

		if (lead.status === LEAD_STATUSES.CONVERTED) {
			throw new Error("Lead is already converted");
		}

		// Convert lead
		const convertedLead = await this.leadRepository.convertToOpportunity(
			leadId,
			amount,
		);

		// Create opportunity
		await this.opportunityRepository.create({
			name: lead.name,
			stage: OPPORTUNITY_STAGES.PROSPECTING,
			amount,
			accountName: lead.company,
			convertedFrom: leadId,
		});

		return convertedLead;
	}

	private validateLeadData(data: CreateLeadRequest): void {
		if (!data.name?.trim()) {
			throw new Error("Lead name is required");
		}
		if (!data.company?.trim()) {
			throw new Error("Company name is required");
		}
		if (!data.email?.trim()) {
			throw new Error("Email is required");
		}
		if (!this.isValidEmail(data.email)) {
			throw new Error("Invalid email format");
		}
		if (data.score < 0 || data.score > 100) {
			throw new Error("Score must be between 0 and 100");
		}
	}

	private validateLeadUpdateData(data: UpdateLeadRequest): void {
		if (data.email && !this.isValidEmail(data.email)) {
			throw new Error("Invalid email format");
		}
		if (data.score !== undefined && (data.score < 0 || data.score > 100)) {
			throw new Error("Score must be between 0 and 100");
		}
	}

	private isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}
}
