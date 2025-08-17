// Date utility functions using date-fns for consistent date handling across the application
import {
	addDays,
	addMonths,
	differenceInDays,
	endOfMonth,
	format,
	formatDistanceToNow,
	formatRelative,
	isThisMonth,
	isThisWeek,
	isToday,
	isValid,
	parseISO,
	startOfMonth,
} from "date-fns";

export const dateUtils = {
	// Format date to readable string
	formatDate: (
		date: string | Date,
		formatStr: string = "MMM dd, yyyy",
	): string => {
		const dateObj = typeof date === "string" ? parseISO(date) : date;

		if (!isValid(dateObj)) {
			return "Invalid date";
		}

		return format(dateObj, formatStr);
	},

	// Format date with time
	formatDateTime: (date: string | Date): string => {
		const dateObj = typeof date === "string" ? parseISO(date) : date;

		if (!isValid(dateObj)) {
			return "Invalid date";
		}

		return format(dateObj, "MMM dd, yyyy HH:mm");
	},

	// Format relative time (e.g., "2 days ago", "1 hour ago")
	formatRelativeTime: (date: string | Date): string => {
		const dateObj = typeof date === "string" ? parseISO(date) : date;

		if (!isValid(dateObj)) {
			return "Invalid date";
		}

		return formatDistanceToNow(dateObj, { addSuffix: true });
	},

	// Get month name
	getMonthName: (date: string | Date): string => {
		const dateObj = typeof date === "string" ? parseISO(date) : date;

		if (!isValid(dateObj)) {
			return "Invalid date";
		}

		return format(dateObj, "MMMM");
	},

	// Get year
	getYear: (date: string | Date): number => {
		const dateObj = typeof date === "string" ? parseISO(date) : date;

		if (!isValid(dateObj)) {
			return 0;
		}

		return dateObj.getFullYear();
	},

	// Check if date is today
	isToday: (date: string | Date): boolean => {
		const dateObj = typeof date === "string" ? parseISO(date) : date;

		if (!isValid(dateObj)) {
			return false;
		}

		return isToday(dateObj);
	},

	// Check if date is this week
	isThisWeek: (date: string | Date): boolean => {
		const dateObj = typeof date === "string" ? parseISO(date) : date;

		if (!isValid(dateObj)) {
			return false;
		}

		return isThisWeek(dateObj);
	},

	// Check if date is this month
	isThisMonth: (date: string | Date): boolean => {
		const dateObj = typeof date === "string" ? parseISO(date) : date;

		if (!isValid(dateObj)) {
			return false;
		}

		return isThisMonth(dateObj);
	},

	// Get start of month
	getStartOfMonth: (date: string | Date): Date => {
		const dateObj = typeof date === "string" ? parseISO(date) : date;

		if (!isValid(dateObj)) {
			return new Date();
		}

		return startOfMonth(dateObj);
	},

	// Get end of month
	getEndOfMonth: (date: string | Date): Date => {
		const dateObj = typeof date === "string" ? parseISO(date) : date;

		if (!isValid(dateObj)) {
			return new Date();
		}

		return endOfMonth(dateObj);
	},

	// Add days to date
	addDays: (date: string | Date, days: number): Date => {
		const dateObj = typeof date === "string" ? parseISO(date) : date;

		if (!isValid(dateObj)) {
			return new Date();
		}

		return addDays(dateObj, days);
	},

	// Add months to date
	addMonths: (date: string | Date, months: number): Date => {
		const dateObj = typeof date === "string" ? parseISO(date) : date;

		if (!isValid(dateObj)) {
			return new Date();
		}

		return addMonths(dateObj, months);
	},

	// Get days between two dates
	getDaysBetween: (
		startDate: string | Date,
		endDate: string | Date,
	): number => {
		const start =
			typeof startDate === "string" ? parseISO(startDate) : startDate;
		const end = typeof endDate === "string" ? parseISO(endDate) : endDate;

		if (!isValid(start) || !isValid(end)) {
			return 0;
		}

		return differenceInDays(end, start);
	},

	// Format date for input fields (YYYY-MM-DD)
	formatForInput: (date: string | Date): string => {
		const dateObj = typeof date === "string" ? parseISO(date) : date;

		if (!isValid(dateObj)) {
			return "";
		}

		return format(dateObj, "yyyy-MM-dd");
	},

	// Parse date from input field
	parseFromInput: (dateString: string): Date | null => {
		const date = parseISO(dateString);
		return isValid(date) ? date : null;
	},

	// Get current timestamp in ISO format
	now: (): string => {
		return new Date().toISOString();
	},

	// Validate date string
	isValidDate: (dateString: string): boolean => {
		const date = parseISO(dateString);
		return isValid(date);
	},

	// Additional utility functions using date-fns
	formatRelative: (
		date: string | Date,
		baseDate: Date = new Date(),
	): string => {
		const dateObj = typeof date === "string" ? parseISO(date) : date;

		if (!isValid(dateObj)) {
			return "Invalid date";
		}

		return formatRelative(dateObj, baseDate);
	},

	// Get week number
	getWeekNumber: (date: string | Date): number => {
		const dateObj = typeof date === "string" ? parseISO(date) : date;

		if (!isValid(dateObj)) {
			return 0;
		}

		return parseInt(format(dateObj, "w"), 10);
	},

	// Check if date is in the past
	isPast: (date: string | Date): boolean => {
		const dateObj = typeof date === "string" ? parseISO(date) : date;

		if (!isValid(dateObj)) {
			return false;
		}

		return dateObj < new Date();
	},

	// Check if date is in the future
	isFuture: (date: string | Date): boolean => {
		const dateObj = typeof date === "string" ? parseISO(date) : date;

		if (!isValid(dateObj)) {
			return false;
		}

		return dateObj > new Date();
	},
};
