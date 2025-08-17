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
						{/* Header */}
						<div className="flex items-center justify-between border-b p-6">
							<h2
								className="font-semibold text-foreground text-lg"
								id={`${uid}-modal-title`}
							>
								Add New Lead
							</h2>
							<button
								onClick={handleClose}
								className="rounded-lg p-2 transition-colors hover:bg-muted"
								type="button"
								aria-label="Close modal"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						{/* Form */}
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="space-y-4 p-6"
							noValidate
						>
							{/* Name */}
							<div>
								<label
									htmlFor={`${uid}-name`}
									className="mb-2 block font-medium text-foreground text-sm"
								>
									Name *
								</label>
								<input
									id={`${uid}-name`}
									type="text"
									className={`w-full rounded-lg border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? "border-destructive" : "border-input"}`}
									placeholder="Enter lead name"
									aria-describedby={
										errors.name ? `${uid}-name-error` : undefined
									}
									aria-invalid={!!errors.name}
									{...register("name")}
								/>
								{errors.name && (
									<p
										id={`${uid}-name-error`}
										className="mt-1 text-destructive text-sm"
										role="alert"
									>
										{errors.name.message}
									</p>
								)}
							</div>

							{/* Company */}
							<div>
								<label
									htmlFor={`${uid}-company`}
									className="mb-2 block font-medium text-foreground text-sm"
								>
									Company *
								</label>
								<input
									id={`${uid}-company`}
									type="text"
									className={`w-full rounded-lg border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${errors.company ? "border-destructive" : "border-input"}`}
									placeholder="Enter company name"
									aria-describedby={
										errors.company ? `${uid}-company-error` : undefined
									}
									aria-invalid={!!errors.company}
									{...register("company")}
								/>
								{errors.company && (
									<p
										id={`${uid}-name-error`}
										className="mt-1 text-destructive text-sm"
										role="alert"
									>
										{errors.company.message}
									</p>
								)}
							</div>

							{/* Email */}
							<div>
								<label
									htmlFor={`${uid}-email`}
									className="mb-2 block font-medium text-foreground text-sm"
								>
									Email *
								</label>
								<input
									id={`${uid}-email`}
									type="email"
									className={`w-full rounded-lg border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? "border-destructive" : "border-input"}`}
									placeholder="Enter email address"
									aria-describedby={
										errors.email ? `${uid}-email-error` : undefined
									}
									aria-invalid={!!errors.email}
									{...register("email")}
								/>
								{errors.email && (
									<p
										id={`${uid}-email-error`}
										className="mt-1 text-destructive text-sm"
										role="alert"
									>
										{errors.email.message}
									</p>
								)}
							</div>

							{/* Source */}
							<div>
								<label
									htmlFor={`${uid}-source`}
									className="mb-2 block font-medium text-foreground text-sm"
								>
									Source
								</label>
								<select
									id={`${uid}-source`}
									className="w-full rounded-lg border border-input px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
									{...register("source")}
								>
									{Object.values(LEAD_SOURCES).map((source) => (
										<option key={source} value={source}>
											{source}
										</option>
									))}
								</select>
							</div>

							{/* Score */}
							<div>
								<label
									htmlFor={`${uid}-score`}
									className="mb-2 block font-medium text-foreground text-sm"
								>
									Score: {watchScore}
								</label>
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
								/>
								{errors.score && (
									<p
										id={`${uid}-score-error`}
										className="mt-1 text-destructive text-sm"
										role="alert"
									>
										{errors.score.message}
									</p>
								)}
							</div>

							{/* Status */}
							<div>
								<label
									htmlFor={`${uid}-status`}
									className="mb-2 block font-medium text-foreground text-sm"
								>
									Status
								</label>
								<select
									id={`${uid}-status`}
									className="w-full rounded-lg border border-input px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
									{...register("status")}
								>
									{Object.values(LEAD_STATUSES)
										.filter((status) => status !== LEAD_STATUSES.CONVERTED)
										.map((status) => (
											<option key={status} value={status}>
												{status}
											</option>
										))}
								</select>
							</div>

							{/* Actions */}
							<div className="flex gap-3 pt-4">
								<Button
									type="submit"
									disabled={isSubmitting || !isDirty}
									className="flex-1"
									aria-describedby="submit-status"
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
									onClick={handleClose}
									className="flex-1"
								>
									<XCircle className="mr-2 h-4 w-4" />
									Cancel
								</Button>
							</div>

							{isSubmitting && (
								<p
									id={`${uid}-submit-status`}
									className="text-center text-muted-foreground text-sm"
								>
									Adding lead...
								</p>
							)}
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
