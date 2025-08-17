import { Keyboard } from "lucide-react";
import { useEffect, useState } from "react";
import { ShortcutsDialog } from "@/components/features/shortcuts-dialog";
import { Button } from "@/components/ui/button";

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
					setIsShortcutsOpen(false);
				}}
			/>
		</>
	);
}
