import { LeadUseCases } from "@/domain/usecases";
import { OpportunityUseCases } from "@/domain/usecases";
import { LeadRepositoryImpl } from "@/domain/repositories/lead-repository-impl";
import { OpportunityRepositoryImpl } from "@/domain/repositories/opportunity-repository-impl";

// Service factory following dependency injection principles
export class ServiceFactory {
	private static instance: ServiceFactory;
	private leadUseCases: LeadUseCases;
	private opportunityUseCases: OpportunityUseCases;

	private constructor() {
		// Create repository instances
		const leadRepository = new LeadRepositoryImpl();
		const opportunityRepository = new OpportunityRepositoryImpl();

		// Create use case instances with dependencies
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

// Convenience function to get services
export const getServices = () => ServiceFactory.getInstance();
