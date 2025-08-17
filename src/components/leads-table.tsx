import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	Calendar,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Download,
	Filter,
	Plus,
	Search,
	X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LeadsTableSkeleton } from "@/components/ui/table-skeleton";
import type { Lead, LeadFilters } from "@/domain/models";
import { dateUtils } from "@/helpers/date";

interface LeadsTableProps {
	leads: Lead[];
	onLeadSelect: (lead: Lead) => void;
	filters: LeadFilters;
	onFiltersChange: (filters: LeadFilters) => void;
	loading: boolean;
	onAddLead: () => void;
	onExport: () => void;
}

export function LeadsTable({
	leads,
	onLeadSelect,
	filters,
	onFiltersChange,
	loading,
	onAddLead,
	onExport,
}: LeadsTableProps) {
	const [searchTerm, setSearchTerm] = useState(filters.search);
	const [statusFilter, setStatusFilter] = useState(filters.status);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const statusOptions = ["", "New", "Qualified", "Hot", "Converted"];

	const filteredAndSortedLeads = useMemo(() => {
		const filtered = leads.filter((lead) => {
			const matchesSearch =
				!searchTerm ||
				lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				lead.company.toLowerCase().includes(searchTerm.toLowerCase());

			const matchesStatus = !statusFilter || lead.status === statusFilter;

			return matchesSearch && matchesStatus;
		});

		filtered.sort((a, b) => {
			let aValue: string | number;
			let bValue: string | number;

			switch (filters.sortBy) {
				case "score":
					aValue = a.score;
					bValue = b.score;
					break;
				case "name":
					aValue = a.name.toLowerCase();
					bValue = b.name.toLowerCase();
					break;
				case "company":
					aValue = a.company.toLowerCase();
					bValue = b.company.toLowerCase();
					break;
				default:
					aValue = a.score;
					bValue = b.score;
			}

			if (typeof aValue === "string" && typeof bValue === "string") {
				return filters.sortOrder === "asc"
					? aValue.localeCompare(bValue)
					: bValue.localeCompare(aValue);
			}

			return filters.sortOrder === "asc"
				? (aValue as number) - (bValue as number)
				: (bValue as number) - (aValue as number);
		});

		return filtered;
	}, [leads, searchTerm, statusFilter, filters.sortBy, filters.sortOrder]);

	const totalItems = filteredAndSortedLeads.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const currentPage = Math.min(page, totalPages);
	const startIndex = (currentPage - 1) * pageSize;
	const endIndex = Math.min(startIndex + pageSize, totalItems);

	const pagedLeads = useMemo(() => {
		return filteredAndSortedLeads.slice(startIndex, endIndex);
	}, [filteredAndSortedLeads, startIndex, endIndex]);

	const handleSearchChange = (value: string) => {
		setSearchTerm(value);
		setPage(1);
		onFiltersChange({ ...filters, search: value });
	};

	const handleStatusChange = (value: string) => {
		setStatusFilter(value);
		setPage(1);
		onFiltersChange({ ...filters, status: value });
	};
	const handleClearFilters = () => {
		setSearchTerm("");
		setStatusFilter("");
		setPage(1);
		onFiltersChange({ ...filters, search: "", status: "" });
	};

	const handleSort = (field: LeadFilters["sortBy"]) => {
		const newSortOrder =
			filters.sortBy === field && filters.sortOrder === "asc" ? "desc" : "asc";
		setPage(1);
		onFiltersChange({ ...filters, sortBy: field, sortOrder: newSortOrder });
	};

	const getSortIcon = (field: LeadFilters["sortBy"]) => {
		if (filters.sortBy !== field) {
			return <ArrowUpDown className="h-4 w-4" />;
		}
		return filters.sortOrder === "asc" ? (
			<ArrowUp className="h-4 w-4" />
		) : (
			<ArrowDown className="h-4 w-4" />
		);
	};

	if (loading) {
		return (
			<div className="flex h-64 items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-primary border-b-2"></div>
			</div>
		);
	}

	if (leads.length === 0) {
		return (
			<div className="py-12 text-center">
				<p className="text-muted-foreground">No leads found</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header with Actions */}
			<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
				<div>
					<h2 className="font-semibold text-foreground text-xl">
						Manage Leads
					</h2>
					<p className="text-muted-foreground text-sm">
						Showing {totalItems === 0 ? 0 : startIndex + 1}–{endIndex} of{" "}
						{totalItems}
						{totalItems !== leads.length
							? ` (filtered from ${leads.length})`
							: ""}{" "}
						leads
					</p>
				</div>

				<div className="flex gap-2">
					<Button
						onClick={onExport}
						variant="outline"
						size="sm"
						className="gap-2"
						data-testid="export-button"
					>
						<Download className="h-4 w-4" />
						Export
					</Button>
					<Button
						onClick={onAddLead}
						size="sm"
						className="gap-2"
						data-testid="add-lead-button"
					>
						<Plus className="h-4 w-4" />
						Add Lead
					</Button>
				</div>
			</div>

			{/* Search and Filters */}
			<div className="flex flex-col gap-4 sm:flex-row">
				<div className="relative flex-1">
					<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
					<input
						type="text"
						placeholder="Search by name or company..."
						value={searchTerm}
						onChange={(e) => handleSearchChange(e.target.value)}
						className="w-full rounded-lg border bg-background py-2.5 pr-4 pl-10 text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
						data-testid="search-input"
					/>
				</div>

				<div className="flex gap-2">
					<div className="relative">
						<Filter className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
						<select
							value={statusFilter}
							onChange={(e) => handleStatusChange(e.target.value)}
							className="h-10 appearance-none rounded-lg border bg-background pr-8 pl-10 text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
							data-testid="status-filter"
						>
							{statusOptions.map((status) => (
								<option key={status} value={status}>
									{status || "All Statuses"}
								</option>
							))}
						</select>
					</div>

					{(searchTerm || statusFilter) && (
						<Button
							onClick={handleClearFilters}
							variant="outline"
							size="lg"
							className="gap-2 rounded-lg px-4"
						>
							<X className="h-4 w-4" />
							<span className="flex items-center gap-2">
								<span>Clear Filters</span>
								<span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-foreground/10 px-1.5 text-[11px] text-foreground">
									{(searchTerm ? 1 : 0) + (statusFilter ? 1 : 0)}
								</span>
							</span>
						</Button>
					)}
				</div>
			</div>

			{/* Table */}
			{loading ? (
				<LeadsTableSkeleton />
			) : (
				<div className="overflow-x-auto rounded-xl border bg-card">
					<table className="w-full min-w-[920px]" data-testid="leads-table">
						<thead className="bg-muted/30">
							<tr>
								<th className="px-6 py-4 text-left font-medium text-foreground text-sm">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleSort("name")}
										className="h-auto p-0 font-medium hover:bg-transparent"
									>
										Name {getSortIcon("name")}
									</Button>
								</th>
								<th className="px-6 py-4 text-left font-medium text-foreground text-sm">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleSort("company")}
										className="h-auto p-0 font-medium hover:bg-transparent"
									>
										Company {getSortIcon("company")}
									</Button>
								</th>
								<th className="px-6 py-4 text-left font-medium text-foreground text-sm">
									Email
								</th>
								<th className="px-6 py-4 text-left font-medium text-foreground text-sm">
									Source
								</th>
								<th className="px-6 py-4 text-left font-medium text-foreground text-sm">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleSort("score")}
										className="h-auto p-0 font-medium hover:bg-transparent"
									>
										Score {getSortIcon("score")}
									</Button>
								</th>
								<th className="px-6 py-4 text-left font-medium text-foreground text-sm">
									Status
								</th>
								<th className="px-6 py-4 text-left font-medium text-foreground text-sm">
									Created
								</th>
							</tr>
						</thead>
						<tbody>
							{pagedLeads.map((lead, index) => (
								<tr
									key={lead.id}
									onClick={() => onLeadSelect(lead)}
									className={`hover-lift hover-scale cursor-pointer border-border border-t hover:bg-muted/30 ${
										(startIndex + index) % 2 === 0 ? "bg-card" : "bg-muted/5"
									}`}
									style={{
										animationDelay: `${index * 50}ms`,
										animation: "fadeInUp 0.3s ease-out forwards",
									}}
								>
									<td className="px-6 py-4">
										<div>
											<div className="font-medium text-foreground">
												{lead.name}
											</div>
										</div>
									</td>
									<td className="px-6 py-4 text-foreground">{lead.company}</td>
									<td className="px-6 py-4 text-foreground">{lead.email}</td>
									<td className="px-6 py-4 text-foreground">{lead.source}</td>
									<td className="px-6 py-4">
										<span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 font-medium text-blue-800 text-xs dark:bg-blue-900/30 dark:text-blue-300">
											{lead.score}
										</span>
									</td>
									<td className="px-6 py-4">
										<span
											className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium text-xs ${
												lead.status === "Hot"
													? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
													: lead.status === "Qualified"
														? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
														: lead.status === "Converted"
															? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
															: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
											}`}
										>
											{lead.status}
										</span>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<Calendar className="h-4 w-4 text-muted-foreground" />
											<div className="text-sm">
												<div className="text-foreground">
													{dateUtils.formatDate(lead.createdAt)}
												</div>
												<div className="text-muted-foreground text-xs">
													{dateUtils.formatRelativeTime(lead.createdAt)}
												</div>
											</div>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{filteredAndSortedLeads.length === 0 && (
				<div className="py-12 text-center">
					<p className="text-muted-foreground">
						No leads match your search criteria
					</p>
				</div>
			)}
			{/* Pagination */}
			{totalItems > 0 && (
				<div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
					<div className="flex items-center gap-2 text-muted-foreground text-sm">
						<span>Rows per page:</span>
						<select
							value={pageSize}
							onChange={(e) => {
								const newSize = Number(e.target.value);
								setPageSize(newSize);
								setPage(1);
							}}
							className="rounded-md border bg-background py-1.5 pr-6 pl-2 text-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
							aria-label="Rows per page"
						>
							{[10, 20, 50, 100].map((size) => (
								<option key={size} value={size}>
									{size}
								</option>
							))}
						</select>
						<span className="hidden sm:inline">|</span>
						<span>
							{startIndex + 1}–{endIndex} of {totalItems}
						</span>
					</div>

					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage(1)}
							disabled={currentPage === 1}
							aria-label="First page"
						>
							<ChevronsLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={currentPage === 1}
							aria-label="Previous page"
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<span className="min-w-[120px] text-center text-muted-foreground text-sm">
							Page {currentPage} of {totalPages}
						</span>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
							disabled={currentPage === totalPages}
							aria-label="Next page"
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setPage(totalPages)}
							disabled={currentPage === totalPages}
							aria-label="Last page"
						>
							<ChevronsRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
