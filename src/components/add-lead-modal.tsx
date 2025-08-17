import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X, XCircle } from "lucide-react";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import type { Lead, LeadSource, LeadStatus } from "@/domain/models";
import { LEAD_SOURCES, LEAD_STATUSES } from "@/domain/models";
import {
	type LeadFormInput,
	LeadFormSchema,
	leadFormDefaults,
} from "@/domain/schemas/lead-schema";
import { dateUtils } from "@/helpers/date";

interface AddLeadModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAdd: (lead: Omit<Lead, "id">) => Promise<void>;
}

interface ModalHeaderProps {
	title: string;
	onClose: () => void;
	uid: string;
}

interface FormFieldProps {
	id: string;
	label: string;
	required?: boolean;
	error?: string;
	children: React.ReactNode;
}

interface FormActionsProps {
	isSubmitting: boolean;
	isDirty: boolean;
	onSubmit: () => void;
	onCancel: () => void;
}

function ModalHeader({ title, onClose, uid }: ModalHeaderProps) {
	return (
		<div className="border-b p-6">
			<div className="mb-2 flex items-center justify-between">
				<h2
					className="font-semibold text-foreground text-lg"
					id={`${uid}-modal-title`}
				>
					{title}
				</h2>
				<Button
					variant="ghost"
					size="sm"
					onClick={onClose}
					className="h-8 w-8 p-0"
					aria-label="Close modal"
				>
					<X className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
}

function FormField({
	id,
	label,
	required = false,
	error,
	children,
}: FormFieldProps) {
	return (
		<div>
			<label
				htmlFor={id}
				className="mb-2 block font-medium text-foreground text-sm"
			>
				{label} {required && "*"}
			</label>
			{children}
			{error && (
				<p
					id={`${id}-error`}
					className="mt-1 text-destructive text-sm"
					role="alert"
				>
					{error}
				</p>
			)}
		</div>
	);
}

function FormActions({
	isSubmitting,
	isDirty,
	onSubmit,
	onCancel,
}: FormActionsProps) {
	return (
		<>
			<div className="flex gap-3 pt-4">
				<Button
					type="submit"
					disabled={isSubmitting || !isDirty}
					className="flex-1"
					onClick={onSubmit}
					data-testid="submit-button"
				>
					{isSubmitting ? (
						<div className="mr-2 h-4 w-4 animate-spin rounded-full border-white border-b-2" />
					) : (
						<Save className="mr-2 h-4 w-4" />
					)}
					Add Lead
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					className="flex-1"
				>
					<XCircle className="mr-2 h-4 w-4" />
					Cancel
				</Button>
			</div>

			{isSubmitting && (
				<p className="text-center text-muted-foreground text-sm">
					Adding lead...
				</p>
			)}
		</>
	);
}

export function AddLeadModal({ isOpen, onClose, onAdd }: AddLeadModalProps) {
	const uid = useId();
	const {
		register,
		handleSubmit,
		setValue,
		reset,
		watch,
		formState: { errors, isSubmitting, isDirty },
	} = useForm<LeadFormInput>({
		resolver: zodResolver(LeadFormSchema),
		defaultValues: leadFormDefaults,
		mode: "onBlur",
		reValidateMode: "onChange",
	});

	const watchScore = watch("score", leadFormDefaults.score);

	if (!isOpen) return null;

	const onSubmit = async (data: LeadFormInput) => {
		try {
			const leadData: Omit<Lead, "id"> = {
				name: data.name,
				company: data.company,
				email: data.email,
				source: data.source as LeadSource,
				score: data.score,
				status: data.status as LeadStatus,
				createdAt: dateUtils.now(),
			};

			await onAdd(leadData);
			onClose();
			reset(leadFormDefaults);
		} catch (error) {
			console.error("Failed to add lead:", error);
			throw error;
		}
	};

	const handleClose = () => {
		reset(leadFormDefaults);
		onClose();
	};

	return (
		<div
			className="fixed inset-0 z-50 overflow-hidden"
			role="dialog"
			aria-modal="true"
		>
			<div className="absolute inset-0 overflow-hidden">
				<div
					className="glass-overlay absolute inset-0 transition-all duration-300 ease-out"
					onClick={handleClose}
					aria-hidden="true"
				/>

				<div className="fixed inset-0 flex items-center justify-center p-4">
					<div
						className="hover-lift relative w-full max-w-md rounded-xl border bg-card shadow-2xl"
						style={{
							animation: "fadeIn 0.3s ease-out",
						}}
					>
						<ModalHeader title="Add New Lead" onClose={handleClose} uid={uid} />

						<form
							onSubmit={handleSubmit(onSubmit)}
							className="space-y-4 p-6"
							noValidate
						>
							<FormField
								id={`${uid}-name`}
								label="Name"
								required
								error={errors.name?.message}
							>
								<input
									id={`${uid}-name`}
									type="text"
									className={`w-full rounded-lg border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
										errors.name ? "border-destructive" : "border-input"
									}`}
									placeholder="Enter lead name"
									aria-describedby={
										errors.name ? `${uid}-name-error` : undefined
									}
									aria-invalid={!!errors.name}
									{...register("name")}
									data-testid="name-input"
								/>
							</FormField>

							<FormField
								id={`${uid}-company`}
								label="Company"
								required
								error={errors.company?.message}
							>
								<input
									id={`${uid}-company`}
									type="text"
									className={`w-full rounded-lg border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
										errors.company ? "border-destructive" : "border-input"
									}`}
									placeholder="Enter company name"
									aria-describedby={
										errors.company ? `${uid}-company-error` : undefined
									}
									aria-invalid={!!errors.company}
									{...register("company")}
									data-testid="company-input"
								/>
							</FormField>

							<FormField
								id={`${uid}-email`}
								label="Email"
								required
								error={errors.email?.message}
							>
								<input
									id={`${uid}-email`}
									type="email"
									className={`w-full rounded-lg border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
										errors.email ? "border-destructive" : "border-input"
									}`}
									placeholder="Enter email address"
									aria-describedby={
										errors.email ? `${uid}-email-error` : undefined
									}
									aria-invalid={!!errors.email}
									{...register("email")}
									data-testid="email-input"
								/>
							</FormField>

							<FormField
								id={`${uid}-source`}
								label="Source"
								error={errors.source?.message}
							>
								<select
									id={`${uid}-source`}
									className="w-full rounded-lg border border-input px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
									{...register("source")}
									data-testid="source-select"
								>
									{Object.values(LEAD_SOURCES).map((source) => (
										<option key={source} value={source}>
											{source}
										</option>
									))}
								</select>
							</FormField>

							<FormField
								id={`${uid}-score`}
								label={`Score: ${watchScore}`}
								error={errors.score?.message}
							>
								<input
									id={`${uid}-score`}
									type="range"
									min="0"
									max="100"
									value={watchScore}
									className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted"
									aria-describedby={
										errors.score ? `${uid}-score-error` : undefined
									}
									onChange={(e) =>
										setValue("score", parseInt(e.target.value, 10), {
											shouldDirty: true,
											shouldValidate: true,
										})
									}
									data-testid="score-input"
								/>
							</FormField>

							<FormField
								id={`${uid}-status`}
								label="Status"
								error={errors.status?.message}
							>
								<select
									id={`${uid}-status`}
									className="w-full rounded-lg border border-input px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
									{...register("status")}
									data-testid="status-select"
								>
									{Object.values(LEAD_STATUSES)
										.filter((status) => status !== LEAD_STATUSES.CONVERTED)
										.map((status) => (
											<option key={status} value={status}>
												{status}
											</option>
										))}
								</select>
							</FormField>

							<FormActions
								isSubmitting={isSubmitting}
								isDirty={isDirty}
								onSubmit={handleSubmit(onSubmit)}
								onCancel={handleClose}
							/>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
