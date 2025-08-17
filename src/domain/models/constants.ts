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

export const STATUS_COLORS = {
	[LEAD_STATUSES.NEW]: {
		light: "bg-blue-100 text-blue-800",
		dark: "dark:bg-blue-900/30 dark:text-blue-300",
	},
	[LEAD_STATUSES.QUALIFIED]: {
		light: "bg-yellow-100 text-yellow-800",
		dark: "dark:bg-yellow-900/30 dark:text-yellow-300",
	},
	[LEAD_STATUSES.HOT]: {
		light: "bg-red-100 text-red-800",
		dark: "dark:bg-red-900/30 dark:text-red-300",
	},
	[LEAD_STATUSES.CONVERTED]: {
		light: "bg-green-100 text-green-800",
		dark: "dark:bg-green-900/30 dark:text-green-300",
	},
} as const;

export const OPPORTUNITY_STAGE_COLORS = {
	[OPPORTUNITY_STAGES.PROSPECTING]: {
		light: "bg-blue-100 text-blue-800",
		dark: "dark:bg-blue-900/30 dark:text-blue-300",
	},
	[OPPORTUNITY_STAGES.QUALIFICATION]: {
		light: "bg-yellow-100 text-yellow-800",
		dark: "dark:bg-yellow-900/30 dark:text-yellow-300",
	},
	[OPPORTUNITY_STAGES.PROPOSAL]: {
		light: "bg-purple-100 text-purple-800",
		dark: "dark:bg-purple-900/30 dark:text-purple-300",
	},
	[OPPORTUNITY_STAGES.NEGOTIATION]: {
		light: "bg-orange-100 text-orange-800",
		dark: "dark:bg-orange-900/30 dark:text-orange-300",
	},
	[OPPORTUNITY_STAGES.CLOSED_WON]: {
		light: "bg-green-100 text-green-800",
		dark: "dark:bg-green-900/30 dark:text-green-300",
	},
	[OPPORTUNITY_STAGES.CLOSED_LOST]: {
		light: "bg-red-100 text-red-800",
		dark: "dark:bg-red-900/30 dark:text-red-300",
	},
} as const;

export const getStatusColor = (status: LeadStatus): string => {
	const statusConfig = STATUS_COLORS[status];
	if (!statusConfig) {
		return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
	}
	return `${statusConfig.light} ${statusConfig.dark}`;
};

export const getOpportunityStageColor = (stage: OpportunityStage): string => {
	const stageConfig = OPPORTUNITY_STAGE_COLORS[stage];
	if (!stageConfig) {
		return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
	}
	return `${stageConfig.light} ${stageConfig.dark}`;
};
