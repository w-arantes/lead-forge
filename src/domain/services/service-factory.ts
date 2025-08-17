import { LeadRepositoryImpl } from "@/domain/repositories/lead-repository-impl";
import { OpportunityRepositoryImpl } from "@/domain/repositories/opportunity-repository-impl";
import { LeadUseCases, OpportunityUseCases } from "@/domain/use-cases";

export class ServiceFactory {
	private static instance: ServiceFactory;
	private leadUseCases: LeadUseCases;
	private opportunityUseCases: OpportunityUseCases;

	private constructor() {
		const leadRepository = new LeadRepositoryImpl();
		const opportunityRepository = new OpportunityRepositoryImpl();

		this.leadUseCases = new LeadUseCases(leadRepository, opportunityRepository);
		this.opportunityUseCases = new OpportunityUseCases(opportunityRepository);
	}

	public static getInstance(): ServiceFactory {
		if (!ServiceFactory.instance) {
			ServiceFactory.instance = new ServiceFactory();
		}
		return ServiceFactory.instance;
	}

	public getLeadUseCases(): LeadUseCases {
		return this.leadUseCases;
	}

	public getOpportunityUseCases(): OpportunityUseCases {
		return this.opportunityUseCases;
	}
}

export const getServices = () => ServiceFactory.getInstance();
