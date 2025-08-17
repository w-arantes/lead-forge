import {
	useAddLeadModalOpen,
	useAppActions,
	useDetailPanelOpen,
	useSelectedLead,
} from "@/domain/infra/store";
import type { Lead } from "@/domain/models";

export function useModalManager() {
	const { setSelectedLead, setDetailPanelOpen, setAddLeadModalOpen } =
		useAppActions();

	const selectedLead = useSelectedLead();
	const isDetailPanelOpen = useDetailPanelOpen();
	const isAddLeadModalOpen = useAddLeadModalOpen();

	const handleLeadSelect = (lead: Lead) => {
		setSelectedLead(lead);
		setDetailPanelOpen(true);
	};

	const handleDetailPanelClose = () => {
		setDetailPanelOpen(false);
		setSelectedLead(null);
	};

	const handleAddLeadModalOpen = () => {
		setAddLeadModalOpen(true);
	};

	const handleAddLeadModalClose = () => {
		setAddLeadModalOpen(false);
	};

	return {
		selectedLead,
		isDetailPanelOpen,
		isAddLeadModalOpen,
		handleLeadSelect,
		handleDetailPanelClose,
		handleAddLeadModalOpen,
		handleAddLeadModalClose,
	};
}
