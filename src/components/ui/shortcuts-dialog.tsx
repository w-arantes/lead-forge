import { Keyboard, X } from "lucide-react";
import { Kbd } from "@/components/ui/kbd";

interface ShortcutsDialogProps {
	isOpen: boolean;
	onClose: () => void;
}

export function ShortcutsDialog({ isOpen, onClose }: ShortcutsDialogProps) {
	if (!isOpen) return null;

	const shortcuts = [
		{
			category: "Navigation",
			items: [
				{ description: "Go to Leads", shortcut: "Ctrl + L" },
				{ description: "Go to Opportunities", shortcut: "Ctrl + O" },
				{ description: "Go to Analytics", shortcut: "Ctrl + A" },
			],
		},
		{
			category: "Analytics Tabs",
			items: [
				{ description: "Overview", shortcut: "Ctrl + 1" },
				{ description: "Leads Analysis", shortcut: "Ctrl + 2" },
				{ description: "Opportunities", shortcut: "Ctrl + 3" },
				{ description: "Conversion", shortcut: "Ctrl + 4" },
				{ description: "Pipeline", shortcut: "Ctrl + 5" },
				{ description: "Timeline", shortcut: "Ctrl + 6" },
			],
		},
		{
			category: "Forms",
			items: [{ description: "Close modal/panel", shortcut: "Esc" }],
		},
	];

	return (
		<div
			className="fixed inset-0 z-50 overflow-hidden"
			role="dialog"
			aria-modal="true"
		>
			<div className="absolute inset-0 overflow-hidden">
				<div
					className="glass-overlay absolute inset-0 transition-all duration-300 ease-out"
					onClick={onClose}
					aria-hidden="true"
				/>

				<div className="fixed inset-0 flex items-center justify-center p-4">
					<div className="hover-lift relative w-full max-w-2xl rounded-xl border bg-card shadow-2xl">
						{/* Header */}
						<div className="flex items-center justify-between border-b p-6">
							<div className="flex items-center gap-3">
								<Keyboard className="h-6 w-6 text-primary" />
								<h2 className="font-semibold text-foreground text-xl">
									Keyboard Shortcuts
								</h2>
							</div>
							<button
								onClick={onClose}
								className="rounded-lg p-2 transition-colors hover:bg-muted"
								type="button"
								aria-label="Close shortcuts"
							>
								<X className="h-5 w-5" />
							</button>
						</div>

						{/* Content */}
						<div className="p-6">
							<div className="space-y-6">
								{shortcuts.map((category) => (
									<div key={category.category}>
										<h3 className="mb-3 font-semibold text-foreground text-lg">
											{category.category}
										</h3>
										<div className="grid gap-3 sm:grid-cols-2">
											{category.items.map((item) => (
												<div
													key={item.description}
													className="flex items-center justify-between rounded-lg border bg-muted/50 p-3"
												>
													<span className="text-muted-foreground text-sm">
														{item.description}
													</span>
													<Kbd>{item.shortcut}</Kbd>
												</div>
											))}
										</div>
									</div>
								))}
							</div>

							<div className="mt-6 border-t pt-6">
								<p className="text-center text-muted-foreground text-sm">
									Use these shortcuts to navigate faster and improve your
									workflow
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
