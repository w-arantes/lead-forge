import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
	title: string;
	rightSlot?: ReactNode;
	isHidden?: boolean;
	className?: string;
}

export function Header({
	title,
	rightSlot,
	isHidden = false,
	className,
}: HeaderProps) {
	return (
		<header
			className={cn(
				"fixed inset-x-0 top-0 z-40",
				"header-scroll",
				isHidden && "header-hidden",
				className,
			)}
		>
			<div
				className={cn(
					"w-full border-b shadow-sm backdrop-blur-md backdrop-saturate-150",
					"border-black/10 bg-white/60 text-foreground dark:border-white/10 dark:bg-white/10 dark:text-foreground",
				)}
			>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between py-3">
						<div className="flex items-center gap-3">
							<h1 className="font-bold text-2xl">{title}</h1>
						</div>
						{rightSlot ? <div>{rightSlot}</div> : null}
					</div>
				</div>
			</div>
		</header>
	);
}
