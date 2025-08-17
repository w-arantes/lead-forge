import type { OpportunityStage } from "./constants";

export interface Opportunity {
	id: string;
	name: string;
	stage: OpportunityStage;
	amount?: number;
	accountName: string;
	convertedFrom: string;
	convertedAt: string;
}

export interface CreateOpportunityRequest {
	name: string;
	stage: OpportunityStage;
	amount?: number;
	accountName: string;
	convertedFrom: string;
}
