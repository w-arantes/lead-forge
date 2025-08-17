import type { Opportunity, CreateOpportunityRequest } from "@/domain/models";
import type { OpportunityRepository } from "@/domain/repositories/opportunity-repository";
import { storage } from "@/domain/infra/storage";

export class OpportunityRepositoryImpl implements OpportunityRepository {
	async getAll(): Promise<Opportunity[]> {
		try {
			await new Promise((resolve) => setTimeout(resolve, 100));
			return storage.getOpportunities();
		} catch (error) {
			throw new Error(
				`Failed to fetch opportunities: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async getById(id: string): Promise<Opportunity | null> {
		try {
			await new Promise((resolve) => setTimeout(resolve, 50));
			const opportunities = storage.getOpportunities();
			return opportunities.find((opp) => opp.id === id) || null;
		} catch (error) {
			throw new Error(
				`Failed to fetch opportunity: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async create(data: CreateOpportunityRequest): Promise<Opportunity> {
		try {
			await new Promise((resolve) => setTimeout(resolve, 200));

			const newOpportunity: Opportunity = {
				...data,
				id: `opp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				convertedAt: new Date().toISOString(),
			};

			const opportunities = storage.getOpportunities();
			opportunities.push(newOpportunity);
			storage.setOpportunities(opportunities);

			return newOpportunity;
		} catch (error) {
			throw new Error(
				`Failed to create opportunity: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async update(id: string, data: Partial<Opportunity>): Promise<Opportunity> {
		try {
			await new Promise((resolve) => setTimeout(resolve, 150));

			const opportunities = storage.getOpportunities();
			const oppIndex = opportunities.findIndex((opp) => opp.id === id);

			if (oppIndex === -1) {
				throw new Error("Opportunity not found");
			}

			opportunities[oppIndex] = { ...opportunities[oppIndex], ...data };
			storage.setOpportunities(opportunities);

			return opportunities[oppIndex];
		} catch (error) {
			throw new Error(
				`Failed to update opportunity: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}

	async delete(id: string): Promise<void> {
		try {
			await new Promise((resolve) => setTimeout(resolve, 100));

			const opportunities = storage.getOpportunities();
			const oppIndex = opportunities.findIndex((opp) => opp.id === id);

			if (oppIndex === -1) {
				throw new Error("Opportunity not found");
			}

			opportunities.splice(oppIndex, 1);
			storage.setOpportunities(opportunities);
		} catch (error) {
			throw new Error(
				`Failed to delete opportunity: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}
}
