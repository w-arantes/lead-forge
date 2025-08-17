import { Keyboard } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShortcutsDialog } from "./shortcuts-dialog";

export function ShortcutsButton() {
	const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
	const [isDesktop, setIsDesktop] = useState(false);

	useEffect(() => {
		const checkScreenSize = () => {
			setIsDesktop(window.innerWidth >= 1024);
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);

		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	const handleClick = () => {
		console.log(
			"Shortcuts button clicked, setting isOpen to:",
			!isShortcutsOpen,
		);
		setIsShortcutsOpen(!isShortcutsOpen);
	};

	if (!isDesktop) return null;

	return (
		<>
			<Button
				variant="ghost"
				size="sm"
				onClick={handleClick}
				className="inline-flex gap-2 text-muted-foreground hover:text-foreground"
				title="Keyboard shortcuts"
			>
				<Keyboard className="h-4 w-4" />
				<span>Shortcuts</span>
			</Button>

			<ShortcutsDialog
				isOpen={isShortcutsOpen}
				onClose={() => {
					console.log("Closing shortcuts dialog");
					setIsShortcutsOpen(false);
				}}
			/>
		</>
	);
}
