import leadsData from "@/data/leads.json";
import { storage } from "@/domain/infra/storage";
import type { Lead } from "@/domain/models";
import {
	LEAD_SOURCES_ARRAY,
	LEAD_STATUSES_ARRAY,
	OPPORTUNITY_STAGES,
} from "@/domain/models";

export class DataSeeder {
	private static instance: DataSeeder;

	private constructor() {}

	public static getInstance(): DataSeeder {
		if (!DataSeeder.instance) {
			DataSeeder.instance = new DataSeeder();
		}
		return DataSeeder.instance;
	}

	// Seed initial data if needed
	async seedInitialData(): Promise<void> {
		const storedLeads = storage.getLeads();
		if (storedLeads.length >= 100) {
			return; // Already seeded
		}

		const byId = new Map<string, Lead>();
		const add = (l: Lead) => byId.set(l.id, l);

		// Add existing stored leads
		for (const l of storedLeads) add(l);

		// Add leads from JSON data
		for (const lead of leadsData as Lead[]) {
			const createdAt = lead.createdAt || this.randomDateWithin(60);
			const lastContacted = lead.lastContacted || createdAt;
			add({ ...lead, createdAt, lastContacted });
		}

		// Generate additional leads if needed
		let i = 1;
		while (byId.size < 100) {
			const candidate = this.generateLead(i);
			if (!byId.has(candidate.id)) add(candidate);
			i++;
		}

		const all = Array.from(byId.values());
		storage.setLeads(all);

		// Also seed some initial opportunities if none exist
		const storedOpportunities = storage.getOpportunities();
		if (storedOpportunities.length === 0) {
			this.seedInitialOpportunities(all);
		}
	}

	private seedInitialOpportunities(leads: Lead[]): void {
		// Create some sample opportunities from converted leads
		const opportunities = [];
		const convertedLeads = leads.filter((lead) => lead.status === "Converted");

		// If no converted leads, create some sample opportunities
		if (convertedLeads.length === 0) {
			opportunities.push({
				id: "opp_sample_1",
				name: "Sample Opportunity 1",
				stage: OPPORTUNITY_STAGES.PROSPECTING,
				amount: 50000,
				accountName: "Sample Company 1",
				convertedFrom: "sample_lead_1",
				convertedAt: new Date(
					Date.now() - 30 * 24 * 60 * 60 * 1000,
				).toISOString(),
			});
			opportunities.push({
				id: "opp_sample_2",
				name: "Sample Opportunity 2",
				stage: OPPORTUNITY_STAGES.QUALIFICATION,
				amount: 75000,
				accountName: "Sample Company 2",
				convertedFrom: "sample_lead_2",
				convertedAt: new Date(
					Date.now() - 15 * 24 * 60 * 60 * 1000,
				).toISOString(),
			});
		} else {
			// Create opportunities from converted leads
			convertedLeads.slice(0, 5).forEach((lead, index) => {
				opportunities.push({
					id: `opp_${lead.id}`,
					name: `${lead.name} - Opportunity`,
					stage: OPPORTUNITY_STAGES.PROSPECTING,
					amount: 25000 + index * 10000,
					accountName: lead.company,
					convertedFrom: lead.id,
					convertedAt: new Date().toISOString(),
				});
			});
		}

		storage.setOpportunities(opportunities);
	}

	private generateLead(i: number): Lead {
		const id = `lead_${this.pad(i)}`;
		const createdAt = this.randomDateWithin(60);
		const lastContacted =
			Math.random() > 0.5 ? this.randomDateWithin(45) : createdAt;
		const name = `Lead ${i}`;
		const company = `Company ${i}`;
		const email = `lead${i}@example.com`;
		const source = LEAD_SOURCES_ARRAY[i % LEAD_SOURCES_ARRAY.length];
		const score = 50 + ((i * 7) % 51); // 50..100
		const status = LEAD_STATUSES_ARRAY[i % LEAD_STATUSES_ARRAY.length];

		return {
			id,
			name,
			company,
			email,
			source,
			score,
			status,
			createdAt,
			lastContacted,
		};
	}

	private pad(num: number, size = 3): string {
		return String(num).padStart(size, "0");
	}

	private randomDateWithin(days: number): string {
		const ms = days * 24 * 60 * 60 * 1000;
		return new Date(Date.now() - Math.floor(Math.random() * ms)).toISOString();
	}
}

export const dataSeeder = DataSeeder.getInstance();
