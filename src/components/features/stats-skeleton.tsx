import { Skeleton } from "@/components/ui/skeleton";

const STATS_SKELETON_KEYS = Array.from(
	{ length: 4 },
	(_, i) => `stats-skeleton-${i}-${Date.now()}`,
);

export function StatsCardsSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			{STATS_SKELETON_KEYS.map((key) => (
				<div key={key} className="rounded-lg border border-border bg-card p-4">
					<div className="relative">
						<div className="space-y-2">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-8 w-16" />
						</div>
						<div className="absolute top-0 right-0">
							<Skeleton className="h-8 w-8 rounded" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
