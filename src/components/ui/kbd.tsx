import { cn } from "@/lib/utils";

interface KbdProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

export function Kbd({ children, className, ...props }: KbdProps) {
	return (
		<div
			className={cn(
				"pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] text-muted-foreground",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
