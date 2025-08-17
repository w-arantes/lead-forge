export const LEAD_SOURCES = {
	WEBSITE: "Website",
	LINKEDIN: "LinkedIn",
	REFERRAL: "Referral",
	COLD_CALL: "Cold Call",
	TRADE_SHOW: "Trade Show",
} as const;

export type LeadSource = (typeof LEAD_SOURCES)[keyof typeof LEAD_SOURCES];

export const LEAD_STATUSES = {
	NEW: "New",
	QUALIFIED: "Qualified",
	HOT: "Hot",
	CONVERTED: "Converted",
} as const;

export type LeadStatus = (typeof LEAD_STATUSES)[keyof typeof LEAD_STATUSES];

export const OPPORTUNITY_STAGES = {
	PROSPECTING: "Prospecting",
	QUALIFICATION: "Qualification",
	PROPOSAL: "Proposal",
	NEGOTIATION: "Negotiation",
	CLOSED_WON: "Closed Won",
	CLOSED_LOST: "Closed Lost",
} as const;

export type OpportunityStage =
	(typeof OPPORTUNITY_STAGES)[keyof typeof OPPORTUNITY_STAGES];

export const LEAD_SOURCES_ARRAY: LeadSource[] = Object.values(LEAD_SOURCES);
export const LEAD_STATUSES_ARRAY: LeadStatus[] = Object.values(LEAD_STATUSES);
export const OPPORTUNITY_STAGES_ARRAY: OpportunityStage[] =
	Object.values(OPPORTUNITY_STAGES);
