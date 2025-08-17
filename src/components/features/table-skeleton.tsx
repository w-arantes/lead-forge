import { useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
	rows?: number;
	columns?: number;
	className?: string;
}

export function TableSkeleton({
	rows = 5,
	columns = 6,
	className,
}: TableSkeletonProps) {
	// Stable keys for columns and rows to avoid using indexes as keys
	const columnsKeysRef = useRef<string[] | null>(null);
	const rowKeysRef = useRef<string[] | null>(null);

	if (!columnsKeysRef.current || columnsKeysRef.current.length !== columns) {
		columnsKeysRef.current = Array.from(
			{ length: columns },
			() => `col-${Math.random().toString(36).slice(2, 9)}-${Date.now()}`,
		);
	}

	if (!rowKeysRef.current || rowKeysRef.current.length !== rows) {
		rowKeysRef.current = Array.from(
			{ length: rows },
			() => `row-${Math.random().toString(36).slice(2, 9)}-${Date.now()}`,
		);
	}

	const columnsKeys = columnsKeysRef.current;
	const rowKeys = rowKeysRef.current;
	return (
		<div className={className}>
			{/* Header skeleton */}
			<div className="border-border border-b">
				<div className="flex items-center gap-4 p-4">
					{columnsKeys.map((key, i) => (
						<Skeleton key={key} className="h-4" width={i === 0 ? 120 : 80} />
					))}
				</div>
			</div>

			{/* Rows skeleton */}
			<div className="divide-y divide-border">
				{rowKeys.map((rowKey) => (
					<div key={rowKey} className="flex items-center gap-4 p-4">
						{columnsKeys.map((colKey, colIndex) => (
							<Skeleton
								key={`${rowKey}-${colKey}`}
								className="h-4"
								width={
									colIndex === 0
										? 100
										: colIndex === 1
											? 150
											: colIndex === 2
												? 120
												: colIndex === 3
													? 80
													: colIndex === 4
														? 60
														: 80
								}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
}

// Specific skeleton for leads table
export function LeadsTableSkeleton() {
	return (
		<div className="overflow-hidden rounded-lg border bg-card">
			<div className="border-border border-b p-6">
				<div className="mb-4 flex items-center justify-between">
					<Skeleton className="h-6 w-32" />
					<div className="flex gap-2">
						<Skeleton className="h-10 w-24" />
						<Skeleton className="h-10 w-24" />
					</div>
				</div>
				<div className="flex gap-4">
					<Skeleton className="h-10 w-64" />
					<Skeleton className="h-10 w-32" />
					<Skeleton className="h-10 w-32" />
				</div>
			</div>
			<TableSkeleton rows={8} columns={7} />
		</div>
	);
}

// Specific skeleton for opportunities table
export function OpportunitiesTableSkeleton() {
	return (
		<div className="overflow-hidden rounded-lg border bg-card">
			<div className="border-border border-b p-6">
				<Skeleton className="h-6 w-40" />
			</div>
			<TableSkeleton rows={4} columns={5} />
		</div>
	);
}
