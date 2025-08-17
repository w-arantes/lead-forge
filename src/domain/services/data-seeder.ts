import leadsData from "@/data/leads.json";
import { storage } from "@/domain/infra/storage";
import type { Lead } from "@/domain/models";
import { LEAD_SOURCES_ARRAY, LEAD_STATUSES } from "@/domain/models";

export class DataSeeder {
	private static instance: DataSeeder;

	private constructor() {}

	public static getInstance(): DataSeeder {
		if (!DataSeeder.instance) {
			DataSeeder.instance = new DataSeeder();
		}
		return DataSeeder.instance;
	}

	async seedInitialData(): Promise<void> {
		const storedLeads = storage.getLeads();
		if (storedLeads.length >= 100) {
			return;
		}

		const byId = new Map<string, Lead>();
		const add = (l: Lead) => byId.set(l.id, l);

		for (const l of storedLeads) add(l);

		for (const lead of leadsData as Lead[]) {
			const createdAt = lead.createdAt || this.randomDateWithin(60);
			const lastContacted = lead.lastContacted || createdAt;
			add({ ...lead, createdAt, lastContacted });
		}

		let i = 1;
		while (byId.size < 100) {
			const candidate = this.generateLead(i);
			if (!byId.has(candidate.id)) add(candidate);
			i++;
		}

		const all = Array.from(byId.values());
		storage.setLeads(all);
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
		const score = 50 + ((i * 7) % 51);

		const availableStatuses = [
			LEAD_STATUSES.NEW,
			LEAD_STATUSES.QUALIFIED,
			LEAD_STATUSES.HOT,
		];
		const status = availableStatuses[i % availableStatuses.length];

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
