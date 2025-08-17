import { Keyboard, KeyboardOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppActions, useShortcutsEnabled } from "@/domain/infra/store";

export function ShortcutsToggle() {
	const shortcutsEnabled = useShortcutsEnabled();
	const { toggleShortcuts } = useAppActions();

	return (
		<Button
			variant="ghost"
			size="sm"
			onClick={toggleShortcuts}
			className="hidden gap-2 text-muted-foreground hover:text-foreground lg:inline-flex"
			title={
				shortcutsEnabled ? "Disable shortcut hints" : "Enable shortcut hints"
			}
		>
			{shortcutsEnabled ? (
				<KeyboardOff className="h-4 w-4" />
			) : (
				<Keyboard className="h-4 w-4" />
			)}
			<span>{shortcutsEnabled ? "Hide Hints" : "Show Hints"}</span>
		</Button>
	);
}
