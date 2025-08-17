import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
	className?: string;
	width?: string | number;
	height?: string | number;
}

export function Skeleton({ className, width, height }: SkeletonProps) {
	return (
		<div
			className={cn("animate-pulse rounded-md bg-muted", className)}
			style={{
				width: width,
				height: height,
			}}
			aria-hidden="true"
		/>
	);
}

export function SkeletonText({
	className,
	lines = 1,
}: {
	className?: string;
	lines?: number;
}) {
	const ids: string[] = useMemo(
		() =>
			Array.from(
				{ length: lines },
				(_, i) => `skeleton-line-${lines}-${i}-${Date.now()}`,
			),
		[lines],
	);

	return (
		<div className={cn("space-y-2", className)}>
			{ids.map((id, i) => (
				<Skeleton
					key={id}
					className="h-4"
					width={i === lines - 1 ? "75%" : "100%"}
				/>
			))}
		</div>
	);
}

export function SkeletonAvatar({ className }: { className?: string }) {
	return (
		<Skeleton
			className={cn("rounded-full", className)}
			width={40}
			height={40}
		/>
	);
}

export function SkeletonButton({ className }: { className?: string }) {
	return <Skeleton className={cn("h-10", className)} width={120} />;
}

export function SkeletonCard({ className }: { className?: string }) {
	return (
		<div className={cn("space-y-3", className)}>
			<Skeleton className="h-4 w-3/4" />
			<Skeleton className="h-4 w-1/2" />
			<Skeleton className="h-4 w-2/3" />
		</div>
	);
}
