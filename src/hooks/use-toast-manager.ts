import { useAppActions, useToasts } from "@/domain/infra/store";

export function useToastManager() {
	const { addToast, removeToast } = useAppActions();
	const toasts = useToasts();

	const showToast = (toast: {
		title: string;
		description?: string;
		type: "success" | "error" | "info" | "warning";
		duration?: number;
	}) => {
		addToast({
			...toast,
			onClose: (id: string) => removeToast(id),
		});
	};

	const showSuccessToast = (title: string, description?: string) => {
		showToast({ title, description, type: "success" });
	};

	const showErrorToast = (title: string, description?: string) => {
		showToast({ title, description, type: "error" });
	};

	const showInfoToast = (title: string, description?: string) => {
		showToast({ title, description, type: "info" });
	};

	const showWarningToast = (title: string, description?: string) => {
		showToast({ title, description, type: "warning" });
	};

	return {
		toasts,
		showToast,
		showSuccessToast,
		showErrorToast,
		showInfoToast,
		showWarningToast,
		removeToast,
	};
}
