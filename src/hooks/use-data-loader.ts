import { useEffect } from "react";
import { useAppActions, useError, useLoading } from "@/domain/infra/store";
import { dataSeeder } from "@/domain/services/data-seeder";
import { api } from "@/helpers/api";

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

				const leads = await api.getLeads();
				setLeads(leads);

				const opportunities = await api.getOpportunities();
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
