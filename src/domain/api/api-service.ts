import type {
	CreateLeadRequest,
	Lead,
	Opportunity,
	UpdateLeadRequest,
} from "@/domain/models";
import { getServices } from "@/domain/services/service-factory";

// API service that uses use cases instead of direct repository access
export class ApiService {
	private static instance: ApiService;
	private services = getServices();

	private constructor() {}

	public static getInstance(): ApiService {
		if (!ApiService.instance) {
			ApiService.instance = new ApiService();
		}
		return ApiService.instance;
	}

	// Lead operations
	async getLeads(): Promise<Lead[]> {
		return this.services.getLeadUseCases().getAllLeads();
	}

	async createLead(leadData: CreateLeadRequest): Promise<Lead> {
		return this.services.getLeadUseCases().createLead(leadData);
	}

	async updateLead(leadId: string, updates: UpdateLeadRequest): Promise<Lead> {
		return this.services.getLeadUseCases().updateLead(leadId, updates);
	}

	async deleteLead(leadId: string): Promise<void> {
		return this.services.getLeadUseCases().deleteLead(leadId);
	}

	async convertLead(lead: Lead, amount?: number): Promise<Lead> {
		return this.services
			.getLeadUseCases()
			.convertLeadToOpportunity(lead.id, amount);
	}

	// Opportunity operations
	async getOpportunities(): Promise<Opportunity[]> {
		return this.services.getOpportunityUseCases().getAllOpportunities();
	}

	async saveOpportunity(opportunity: Opportunity): Promise<Opportunity> {
		// For now, we'll create a new opportunity
		// In a real app, you might want to check if it exists first
		return this.services.getOpportunityUseCases().createOpportunity({
			name: opportunity.name,
			stage: opportunity.stage,
			amount: opportunity.amount,
			accountName: opportunity.accountName,
			convertedFrom: opportunity.convertedFrom,
		});
	}
}

// Export singleton instance
export const apiService = ApiService.getInstance();
