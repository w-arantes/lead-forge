import { useAppActions, useFilters } from "@/domain/infra/store";
import type { LeadFilters } from "@/domain/models";

export function useFilterManager() {
	const { updateFilters, resetFilters } = useAppActions();
	const filters = useFilters();

	const handleFiltersChange = (newFilters: Partial<LeadFilters>) => {
		updateFilters(newFilters);
	};

	const handleFilterChange = (
		filterType: keyof LeadFilters,
		value: string | number,
	) => {
		updateFilters({ [filterType]: value });
	};

	const handleResetFilters = () => {
		resetFilters();
	};

	return {
		filters,
		handleFiltersChange,
		handleFilterChange,
		handleResetFilters,
	};
}
