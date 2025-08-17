import { storage } from "@/domain/infra/storage";
import type {
	CreateLeadRequest,
	Lead,
	UpdateLeadRequest,
} from "@/domain/models";
import { LEAD_STATUSES } from "@/domain/models";
import type { LeadRepository } from "@/domain/repositories/lead-repository";

export class LeadRepositoryImpl implements LeadRepository {
	async getAll(): Promise<Lead[]> {
		try {
			// Simulate API delay
			await new Promise((resolve) => setTimeout(resolve, 100));
			return storage.getLeads();
		} catch (error) {
			throw new Error(
				`Failed to fetch leads: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async getById(id: string): Promise<Lead | null> {
		try {
			await new Promise((resolve) => setTimeout(resolve, 50));
			const leads = storage.getLeads();
			return leads.find((lead) => lead.id === id) || null;
		} catch (error) {
			throw new Error(
				`Failed to fetch lead: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async create(data: CreateLeadRequest): Promise<Lead> {
		try {
			await new Promise((resolve) => setTimeout(resolve, 200));

			const newLead: Lead = {
				...data,
				id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				createdAt: data.createdAt || new Date().toISOString(),
				lastContacted: new Date().toISOString(),
			};

			// Don't update storage here - let the store handle it
			return newLead;
		} catch (error) {
			throw new Error(
				`Failed to create lead: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async update(id: string, data: UpdateLeadRequest): Promise<Lead> {
		try {
			await new Promise((resolve) => setTimeout(resolve, 150));

			const leads = storage.getLeads();
			const leadIndex = leads.findIndex((lead) => lead.id === id);

			if (leadIndex === -1) {
				throw new Error("Lead not found");
			}

			leads[leadIndex] = { ...leads[leadIndex], ...data };
			return leads[leadIndex];
		} catch (error) {
			throw new Error(
				`Failed to update lead: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async delete(id: string): Promise<void> {
		try {
			await new Promise((resolve) => setTimeout(resolve, 100));

			const leads = storage.getLeads();
			const leadIndex = leads.findIndex((lead) => lead.id === id);

			if (leadIndex === -1) {
				throw new Error("Lead not found");
			}

			leads.splice(leadIndex, 1);
			storage.setLeads(leads);
		} catch (error) {
			throw new Error(
				`Failed to delete lead: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async convertToOpportunity(id: string, _amount?: number): Promise<Lead> {
		try {
			await new Promise((resolve) => setTimeout(resolve, 300));

			const leads = storage.getLeads();
			const leadIndex = leads.findIndex((lead) => lead.id === id);

			if (leadIndex === -1) {
				throw new Error("Lead not found");
			}

			leads[leadIndex].status = LEAD_STATUSES.CONVERTED;
			leads[leadIndex].convertedAt = new Date().toISOString();

			storage.setLeads(leads);

			return leads[leadIndex];
		} catch (error) {
			throw new Error(
				`Failed to convert lead: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}
}
