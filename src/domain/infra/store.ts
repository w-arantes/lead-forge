import { create } from "zustand";
import { persist } from "zustand/middleware";

import { STORAGE_KEYS } from "@/constants/storage";
import type { Lead, LeadFilters, Opportunity } from "@/domain/models";
import { LEAD_STATUSES, OPPORTUNITY_STAGES } from "@/domain/models";
import { storage } from "./storage";

interface AppState {
	leads: Lead[];
	opportunities: Opportunity[];
	loading: boolean;
	error: string | null;
	activeTab: "leads" | "opportunities" | "analytics";
	isHeaderHidden: boolean;
	shortcutsEnabled: boolean;
	filters: LeadFilters;
	selectedLead: Lead | null;
	isDetailPanelOpen: boolean;
	isAddLeadModalOpen: boolean;
	toasts: Array<{
		id: string;
		title: string;
		description?: string;
		type: "success" | "error" | "info" | "warning";
		duration?: number;
		onClose: (id: string) => void;
	}>;
}

interface AppActions {
	setLeads: (leads: Lead[]) => void;
	addLead: (lead: Lead) => void;
	updateLead: (id: string, updates: Partial<Lead>) => void;
	deleteLead: (id: string) => void;
	setOpportunities: (opportunities: Opportunity[]) => void;
	addOpportunity: (opportunity: Opportunity) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	setActiveTab: (tab: AppState["activeTab"]) => void;
	setHeaderHidden: (hidden: boolean) => void;
	toggleShortcuts: () => void;
	updateFilters: (filters: Partial<LeadFilters>) => void;
	resetFilters: () => void;
	setSelectedLead: (lead: Lead | null) => void;
	setDetailPanelOpen: (open: boolean) => void;
	setAddLeadModalOpen: (open: boolean) => void;
	addToast: (toast: Omit<AppState["toasts"][0], "id">) => void;
	removeToast: (id: string) => void;
	convertLead: (lead: Lead, amount?: number) => Promise<Opportunity>;
	exportData: () => Promise<void>;
}

type AppStore = AppState & AppActions;

const defaultFilters: LeadFilters = {
	search: "",
	status: "",
	sortBy: "score",
	sortOrder: "desc",
};

const createToastId = (): string => Math.random().toString(36).substr(2, 9);

const createOpportunity = (lead: Lead, amount?: number): Opportunity => ({
	id: `opp_${Date.now()}`,
	name: lead.name,
	stage: OPPORTUNITY_STAGES.PROSPECTING,
	amount,
	accountName: lead.company,
	convertedFrom: lead.id,
	convertedAt: new Date().toISOString(),
});

export const useAppStore = create<AppStore>()(
	persist(
		(set, get) => ({
			leads: storage.getLeads(),
			opportunities: storage.getOpportunities(),
			loading: false,
			error: null,
			activeTab: "leads",
			isHeaderHidden: false,
			shortcutsEnabled: false,
			filters: defaultFilters,
			selectedLead: null,
			isDetailPanelOpen: false,
			isAddLeadModalOpen: false,
			toasts: [],

			setLeads: (leads) => {
				set({ leads });
				storage.setLeads(leads);
			},

			addLead: (lead) => {
				set((state) => {
					const newLeads = [...state.leads, lead];
					storage.setLeads(newLeads);
					return { leads: newLeads };
				});
			},

			updateLead: (id, updates) => {
				set((state) => {
					const updatedLeads = state.leads.map((lead) =>
						lead.id === id ? { ...lead, ...updates } : lead,
					);
					storage.setLeads(updatedLeads);
					return { leads: updatedLeads };
				});
			},

			deleteLead: (id) => {
				set((state) => {
					const filteredLeads = state.leads.filter((lead) => lead.id !== id);
					storage.setLeads(filteredLeads);
					return { leads: filteredLeads };
				});
			},

			setOpportunities: (opportunities) => {
				set({ opportunities });
				storage.setOpportunities(opportunities);
			},

			addOpportunity: (opportunity) => {
				set((state) => {
					const newOpportunities = [...state.opportunities, opportunity];
					storage.setOpportunities(newOpportunities);
					return { opportunities: newOpportunities };
				});
			},

			setLoading: (loading) => set({ loading }),
			setError: (error) => set({ error }),
			setActiveTab: (activeTab) => set({ activeTab }),
			setHeaderHidden: (isHeaderHidden) => set({ isHeaderHidden }),
			toggleShortcuts: () =>
				set((state) => ({ shortcutsEnabled: !state.shortcutsEnabled })),

			updateFilters: (newFilters) => {
				set((state) => ({
					filters: { ...state.filters, ...newFilters },
				}));
			},

			resetFilters: () => set({ filters: defaultFilters }),
			setSelectedLead: (selectedLead) => set({ selectedLead }),
			setDetailPanelOpen: (isDetailPanelOpen) => set({ isDetailPanelOpen }),
			setAddLeadModalOpen: (isAddLeadModalOpen) => set({ isAddLeadModalOpen }),

			addToast: (toast) => {
				const id = createToastId();
				set((state) => ({
					toasts: [
						...state.toasts,
						{ ...toast, id, onClose: (id: string) => get().removeToast(id) },
					],
				}));
				setTimeout(() => get().removeToast(id), toast.duration || 5000);
			},

			removeToast: (id) => {
				set((state) => ({
					toasts: state.toasts.filter((toast) => toast.id !== id),
				}));
			},

			convertLead: async (lead, amount) => {
				const opportunity = createOpportunity(lead, amount);
				get().updateLead(lead.id, { status: LEAD_STATUSES.CONVERTED });
				get().addOpportunity(opportunity);
				return opportunity;
			},

			exportData: async () => {
				const state = get();
				await storage.exportLeadsToCSV(state.leads);
				await storage.exportOpportunitiesToCSV(state.opportunities);
			},
		}),
		{
			name: STORAGE_KEYS.ZUSTAND_STORE,
			partialize: (state) => ({
				leads: state.leads,
				opportunities: state.opportunities,
				filters: state.filters,
				activeTab: state.activeTab,
				shortcutsEnabled: state.shortcutsEnabled,
			}),
			onRehydrateStorage: () => (state) => {
				if (state) {
					state.leads = storage.getLeads();
					state.opportunities = storage.getOpportunities();
				}
			},
		},
	),
);

export const useLeads = () => useAppStore((state) => state.leads);
export const useOpportunities = () =>
	useAppStore((state) => state.opportunities);
export const useLoading = () => useAppStore((state) => state.loading);
export const useError = () => useAppStore((state) => state.error);
export const useActiveTab = () => useAppStore((state) => state.activeTab);
export const useIsHeaderHidden = () =>
	useAppStore((state) => state.isHeaderHidden);
export const useShortcutsEnabled = () =>
	useAppStore((state) => state.shortcutsEnabled);
export const useFilters = () => useAppStore((state) => state.filters);
export const useSelectedLead = () => useAppStore((state) => state.selectedLead);
export const useDetailPanelOpen = () =>
	useAppStore((state) => state.isDetailPanelOpen);
export const useAddLeadModalOpen = () =>
	useAppStore((state) => state.isAddLeadModalOpen);
export const useToasts = () => useAppStore((state) => state.toasts);

export const useAppActions = () => {
	const state = useAppStore.getState();
	return {
		setLeads: state.setLeads,
		addLead: state.addLead,
		updateLead: state.updateLead,
		deleteLead: state.deleteLead,
		setOpportunities: state.setOpportunities,
		addOpportunity: state.addOpportunity,
		setLoading: state.setLoading,
		setError: state.setError,
		setActiveTab: state.setActiveTab,
		setHeaderHidden: state.setHeaderHidden,
		toggleShortcuts: state.toggleShortcuts,
		updateFilters: state.updateFilters,
		resetFilters: state.resetFilters,
		setSelectedLead: state.setSelectedLead,
		setDetailPanelOpen: state.setDetailPanelOpen,
		setAddLeadModalOpen: state.setAddLeadModalOpen,
		addToast: state.addToast,
		removeToast: state.removeToast,
		convertLead: state.convertLead,
		exportData: state.exportData,
	};
};
