import { zodResolver } from "@hookform/resolvers/zod";
import { Edit3, Save, X, XCircle } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import type { Lead, LeadStatus, Opportunity } from "@/domain/models";
import { LEAD_STATUSES } from "@/domain/models";
import {
	type ConvertToOpportunityInput,
	ConvertToOpportunitySchema,
	type LeadUpdateInput,
	LeadUpdateSchema,
} from "@/domain/schemas/lead-schema";

interface LeadDetailPanelProps {
	lead: Lead | null;
	isOpen: boolean;
	onClose: () => void;
	onUpdate: (leadId: string, updates: Partial<Lead>) => Promise<void>;
	onConvert: (lead: Lead, amount?: number) => Promise<Opportunity>;
	opportunities: Opportunity[];
}

export function LeadDetailPanel({
	lead,
	isOpen,
	onClose,
	onUpdate,
	onConvert,
	opportunities,
}: LeadDetailPanelProps) {
	const uid = useId();
	const [isEditing, setIsEditing] = useState(false);
	const [isUpdating, setIsUpdating] = useState(false);
	const [isConverting, setIsConverting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		reset: resetEdit,
		formState: { errors: editErrors, isDirty: isEditDirty },
	} = useForm<LeadUpdateInput>({
		resolver: zodResolver(LeadUpdateSchema),
		defaultValues: {
			email: lead?.email ?? "",
			status: lead?.status ?? LEAD_STATUSES.NEW,
		},
		mode: "onBlur",
		reValidateMode: "onChange",
	});

	const {
		handleSubmit: handleConvertSubmit,
		reset: resetConvert,
		formState: { errors: convertErrors },
		watch,
		setValue,
	} = useForm<ConvertToOpportunityInput>({
		resolver: zodResolver(ConvertToOpportunitySchema),
		defaultValues: { amount: undefined },
		mode: "onBlur",
	});

	const amountValue = watch("amount");

	useEffect(() => {
		if (lead && isOpen) {
			resetEdit({ email: lead.email, status: lead.status });
			resetConvert({ amount: undefined });
		}
	}, [lead, isOpen, resetEdit, resetConvert]);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) return;

			if (e.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!lead || !isOpen) return null;

	const handleEdit = () => {
		setIsEditing(true);
		setError(null);
	};

	const handleCancel = () => {
		setIsEditing(false);
		resetEdit({ email: lead.email, status: lead.status });
		setError(null);
	};

	const onSubmitEdit = async (data: LeadUpdateInput) => {
		setIsUpdating(true);
		setError(null);
		try {
			const updates: Partial<Lead> = {
				email: data.email,
				status: data.status as LeadStatus,
			};
			await onUpdate(lead.id, updates);
			setIsEditing(false);
			resetEdit({ email: data.email, status: data.status });
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update lead");
		} finally {
			setIsUpdating(false);
		}
	};

	const onSubmitConvert = async (data: ConvertToOpportunityInput) => {
		setIsConverting(true);
		setError(null);
		try {
			const amount = data.amount ? parseFloat(data.amount) : undefined;
			await onConvert(lead, amount);
			setIsConverting(false);
			resetConvert();
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to convert lead");
		} finally {
			setIsConverting(false);
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case LEAD_STATUSES.NEW:
				return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
			case LEAD_STATUSES.QUALIFIED:
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
			case LEAD_STATUSES.HOT:
				return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
			case LEAD_STATUSES.CONVERTED:
				return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
		}
	};

	return (
		<div className="fixed inset-0 z-50 overflow-hidden">
			<div className="absolute inset-0 overflow-hidden">
				<button
					type="button"
					className="glass-overlay absolute inset-0 transition-all duration-300 ease-out"
					aria-label="Close panel"
					onClick={onClose}
				/>

				<div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
					<div className="relative w-screen max-w-md">
						<div
							className="hover-lift flex h-full flex-col bg-card shadow-xl"
							style={{
								animation: "slideInRight 0.3s ease-out",
							}}
						>
							{/* Header */}
							<div className="bg-primary px-4 py-6 text-primary-foreground sm:px-6">
								<div className="flex items-center justify-between">
									<div>
										<h2 className="font-medium text-lg">Lead Details</h2>
										<p className="mt-1 text-primary-foreground/70 text-xs">
											Press Esc to close • Ctrl+Enter to submit
										</p>
									</div>
									<button
										type="button"
										onClick={onClose}
										className="rounded-md text-primary-foreground/90 hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring"
									>
										<X className="h-6 w-6" />
									</button>
								</div>
							</div>

							{/* Content */}
							<div className="flex-1 overflow-y-auto">
								<div className="space-y-6 px-4 py-6 sm:px-6">
									{/* Error Message */}
									{error && (
										<div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-destructive">
											<div className="flex">
												<div className="text-sm">{error}</div>
											</div>
										</div>
									)}

									{/* Lead Information */}
									<div className="space-y-4">
										<div>
											<div className="block text-muted-foreground text-sm">
												Name
											</div>
											<p className="mt-1 text-foreground text-sm">
												{lead.name}
											</p>
										</div>

										<div>
											<div className="block text-muted-foreground text-sm">
												Company
											</div>
											<p className="mt-1 text-foreground text-sm">
												{lead.company}
											</p>
										</div>

										<div>
											{isEditing ? (
												<>
													<label
														htmlFor={`${uid}-edit-email`}
														className="block text-muted-foreground text-sm"
													>
														Email
													</label>
													<input
														id={`${uid}-edit-email`}
														type="email"
														aria-invalid={!!editErrors.email}
														aria-describedby={
															editErrors.email
																? `${uid}-edit-email-error`
																: undefined
														}
														className="mt-1 block h-10 w-full rounded-lg border-input bg-background px-3 shadow-sm focus:border-ring focus:ring-ring sm:text-sm"
														{...register("email")}
													/>
													{editErrors.email && (
														<p
															id={`${uid}-edit-email-error`}
															className="mt-1 text-destructive text-xs"
														>
															{editErrors.email.message}
														</p>
													)}
												</>
											) : (
												<>
													<div className="block text-muted-foreground text-sm">
														Email
													</div>
													<p className="mt-1 text-foreground text-sm">
														{lead.email}
													</p>
												</>
											)}
										</div>

										<div>
											<div className="block text-muted-foreground text-sm">
												Source
											</div>
											<p className="mt-1 text-foreground text-sm">
												{lead.source}
											</p>
										</div>

										<div>
											<div className="block text-muted-foreground text-sm">
												Score
											</div>
											<span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 font-medium text-blue-800 text-xs dark:bg-blue-900/30 dark:text-blue-300">
												{lead.score}
											</span>
										</div>

										<div>
											{isEditing ? (
												<>
													<label
														htmlFor={`${uid}-edit-status`}
														className="block text-muted-foreground text-sm"
													>
														Status
													</label>
													<select
														id={`${uid}-edit-status`}
														aria-invalid={!!editErrors.status}
														aria-describedby={
															editErrors.status
																? `${uid}-edit-status-error`
																: undefined
														}
														className="mt-1 block h-10 w-full rounded-lg border-input bg-background px-3 shadow-sm focus:border-ring focus:ring-ring sm:text-sm"
														{...register("status")}
													>
														<option value={LEAD_STATUSES.NEW}>
															{LEAD_STATUSES.NEW}
														</option>
														<option value={LEAD_STATUSES.QUALIFIED}>
															{LEAD_STATUSES.QUALIFIED}
														</option>
														<option value={LEAD_STATUSES.HOT}>
															{LEAD_STATUSES.HOT}
														</option>
														<option value={LEAD_STATUSES.CONVERTED}>
															{LEAD_STATUSES.CONVERTED}
														</option>
													</select>
													{editErrors.status && (
														<p
															id={`${uid}-edit-status-error`}
															className="mt-1 text-destructive text-xs"
														>
															{editErrors.status.message}
														</p>
													)}
												</>
											) : (
												<span
													className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${getStatusColor(lead.status)}`}
												>
													{lead.status}
												</span>
											)}
										</div>
									</div>

									{/* Edit Actions */}
									{!isEditing ? (
										<Button
											onClick={handleEdit}
											variant="outline"
											className="w-full"
										>
											<Edit3 className="mr-2 h-4 w-4" />
											Edit Lead
										</Button>
									) : (
										<form
											onSubmit={handleSubmit(onSubmitEdit)}
											className="flex gap-2"
										>
											<Button
												type="submit"
												disabled={isUpdating || !isEditDirty}
												className="flex-1"
											>
												{isUpdating ? (
													<div className="mr-2 h-4 w-4 animate-spin rounded-full border-white border-b-2" />
												) : (
													<Save className="mr-2 h-4 w-4" />
												)}
												Save
											</Button>
											<Button
												onClick={handleCancel}
												type="button"
												variant="outline"
												className="flex-1"
											>
												<XCircle className="mr-2 h-4 w-4" />
												Cancel
											</Button>
										</form>
									)}

									{/* Convert to Opportunity */}
									{lead.status !== "Converted" && (
										<div className="border-t pt-6">
											<h3 className="mb-4 font-medium text-foreground text-lg">
												Convert to Opportunity
											</h3>

											<form
												onSubmit={handleConvertSubmit(onSubmitConvert)}
												className="space-y-4"
											>
												<div>
													<label
														htmlFor={`${uid}-convert-amount`}
														className="block text-muted-foreground text-sm"
													>
														Amount (Optional)
													</label>

													<div className="relative mt-1">
														<input
															id={`${uid}-convert-amount`}
															type="number"
															step="0.01"
															min="0"
															placeholder="Enter amount (e.g., 1500.00)"
															value={amountValue || ""}
															onChange={(e) =>
																setValue("amount", e.target.value)
															}
															aria-invalid={!!convertErrors.amount}
															aria-describedby={
																convertErrors.amount
																	? `${uid}-convert-amount-error`
																	: undefined
															}
															className="block h-10 w-full rounded-lg border-input bg-background px-3 pr-12 shadow-sm transition-colors focus:border-ring focus:ring-ring sm:text-sm"
														/>
														<div className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 font-medium text-muted-foreground text-sm">
															USD
														</div>
														{convertErrors.amount && (
															<p
																id={`${uid}-convert-amount-error`}
																className="mt-1 text-destructive text-xs"
															>
																{convertErrors.amount.message}
															</p>
														)}
													</div>
												</div>

												<Button
													type="submit"
													disabled={isConverting}
													className="w-full bg-green-600 hover:bg-green-700"
												>
													{isConverting ? (
														<div className="mr-2 h-4 w-4 animate-spin rounded-full border-white border-b-2" />
													) : null}
													Convert Lead
												</Button>
											</form>
										</div>
									)}

									{/* Related Opportunities */}
									{opportunities.length > 0 && (
										<div className="border-t pt-6">
											<h3 className="mb-4 font-medium text-foreground text-lg">
												Related Opportunities
											</h3>
											<div className="space-y-2">
												{opportunities
													.filter((opp) => opp.convertedFrom === lead.id)
													.map((opp) => (
														<div
															key={opp.id}
															className="rounded-md bg-muted p-3"
														>
															<div className="flex items-start justify-between">
																<div>
																	<p className="font-medium text-foreground text-sm">
																		{opp.name}
																	</p>
																	<p className="text-muted-foreground text-sm">
																		{opp.stage}
																	</p>
																</div>
																{opp.amount && (
																	<span className="font-medium text-emerald-600 text-sm dark:text-emerald-400">
																		${opp.amount.toLocaleString()}
																	</span>
																)}
															</div>
														</div>
													))}
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
