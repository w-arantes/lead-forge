import { AnvilIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
	children: ReactNode;
	isHidden?: boolean;
	className?: string;
}

interface HeaderLogoProps {
	className?: string;
}

interface HeaderTitleProps {
	children: ReactNode;
	className?: string;
}

interface HeaderLeftProps {
	children: ReactNode;
	className?: string;
}

interface HeaderRightSlotProps {
	children: ReactNode;
	className?: string;
}

function HeaderLogo({ className }: HeaderLogoProps) {
	return <AnvilIcon className={cn("size-6", className)} data-testid="logo" />;
}

function HeaderTitle({ children, className }: HeaderTitleProps) {
	return <h1 className={cn("font-bold text-2xl", className)}>{children}</h1>;
}

function HeaderLeft({ children, className }: HeaderLeftProps) {
	return (
		<div className={cn("flex items-center gap-3", className)}>{children}</div>
	);
}

function HeaderRightSlot({ children, className }: HeaderRightSlotProps) {
	return (
		<div className={cn("flex items-center gap-2", className)}>{children}</div>
	);
}

export function Header({ children, isHidden = false, className }: HeaderProps) {
	return (
		<header
			className={cn(
				"fixed inset-x-0 top-0 z-40",
				"header-scroll",
				isHidden && "header-hidden",
				className,
			)}
			data-testid="header"
		>
			<div
				className={cn(
					"w-full border-b shadow-sm backdrop-blur-md backdrop-saturate-150",
					"border-black/10 bg-white/60 text-foreground dark:border-white/10 dark:bg-white/10 dark:text-foreground",
				)}
			>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between py-3">
						{children}
					</div>
				</div>
			</div>
		</header>
	);
}

Header.Logo = HeaderLogo;
Header.Title = HeaderTitle;
Header.Left = HeaderLeft;
Header.RightSlot = HeaderRightSlot;
