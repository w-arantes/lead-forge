import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface ToastProps {
	id: string;
	title: string;
	description?: string;
	type?: "success" | "error" | "info" | "warning";
	duration?: number;
	onClose: (id: string) => void;
}

const toastIcons = {
	success: CheckCircle,
	error: AlertCircle,
	info: Info,
	warning: AlertCircle,
};

const toastStyles = {
	success:
		"border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200",
	error:
		"border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
	info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200",
	warning:
		"border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
};

export function Toast({
	id,
	title,
	description,
	type = "info",
	duration = 5000,
	onClose,
}: ToastProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [isExiting, setIsExiting] = useState(false);

	useEffect(() => {
		// Show toast with animation
		const showTimer = setTimeout(() => setIsVisible(true), 100);

		// Auto-hide toast
		const hideTimer = setTimeout(() => {
			setIsExiting(true);
			setTimeout(() => onClose(id), 300);
		}, duration);

		return () => {
			clearTimeout(showTimer);
			clearTimeout(hideTimer);
		};
	}, [id, duration, onClose]);

	const handleClose = () => {
		setIsExiting(true);
		setTimeout(() => onClose(id), 300);
	};

	const Icon = toastIcons[type];

	return (
		<div
			className={cn(
				"relative w-full max-w-sm rounded-lg border bg-white p-4 shadow-lg transition-all duration-300 ease-out dark:bg-gray-900",
				toastStyles[type],
				isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
				isExiting
					? "translate-x-full scale-95 opacity-0"
					: "translate-x-0 scale-100 opacity-100",
			)}
			role="alert"
			aria-live="polite"
			aria-atomic="true"
			data-testid={`toast-${type}`}
		>
			<div className="flex items-start gap-3">
				<Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
				<div className="min-w-0 flex-1">
					<h3 className="font-medium text-sm">{title}</h3>
					{description && (
						<p className="mt-1 text-sm opacity-90">{description}</p>
					)}
				</div>
				<button
					type="button"
					onClick={handleClose}
					className="flex-shrink-0 rounded-md p-1 transition-colors hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2 focus:ring-offset-transparent dark:hover:bg-white/10"
					aria-label="Close notification"
				>
					<X className="h-4 w-4" />
				</button>
			</div>

			{/* Progress bar */}
			<div
				className="absolute bottom-0 left-0 h-1 rounded-b-lg bg-current opacity-20 transition-all duration-300 ease-linear"
				style={{ width: isExiting ? "0%" : "100%" }}
			/>
		</div>
	);
}

export interface ToastContainerProps {
	toasts: ToastProps[];
	onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
	return (
		<div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-2">
			{toasts.map((toast) => (
				<Toast key={toast.id} {...toast} onClose={onClose} />
			))}
		</div>
	);
}
