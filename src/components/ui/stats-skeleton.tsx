import { Skeleton } from "./skeleton";

const STATS_SKELETON_KEYS = Array.from(
	{ length: 4 },
	(_, i) => `stats-skel-${i}-${Date.now()}`,
);

export function StatsCardsSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
			{STATS_SKELETON_KEYS.map((key) => (
				<div key={key} className="rounded-lg border border-border bg-card p-4">
					<div className="flex items-center justify-between">
						<div className="space-y-2">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-8 w-16" />
						</div>
						<Skeleton className="h-8 w-8 rounded" />
					</div>
				</div>
			))}
		</div>
	);
}
