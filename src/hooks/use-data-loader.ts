import { useEffect } from "react";
import { apiService } from "@/domain/infra/http";
import { useAppActions, useError, useLoading } from "@/domain/infra/store";
import { dataSeeder } from "@/domain/services/data-seeder";

export function useDataLoader() {
	const { setLeads, setOpportunities, setLoading, setError } = useAppActions();
	const loading = useLoading();
	const error = useError();

	useEffect(() => {
		const loadData = async () => {
			try {
				setLoading(true);
				setError(null);

				await dataSeeder.seedInitialData();

				const leads = await apiService.getLeads();
				setLeads(leads);

				const opportunities = await apiService.getOpportunities();
				setOpportunities(opportunities);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Failed to load data");
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [setLeads, setOpportunities, setLoading, setError]);

	return { loading, error };
}
