import { z } from "zod";

/**
 * Helper function to format Zod validation errors into a user-friendly format
 */
export function formatValidationErrors(
	error: z.ZodError,
): Record<string, string> {
	const errors: Record<string, string> = {};
	error.issues.forEach((issue) => {
		const field = issue.path[0] as string;
		errors[field] = issue.message;
	});
	return errors;
}

/**
 * Helper function to validate data against a Zod schema and return formatted errors
 */
export function validateWithZod<T>(
	schema: z.ZodSchema<T>,
	data: unknown,
): { isValid: boolean; errors: Record<string, string>; parsedData?: T } {
	try {
		const parsedData = schema.parse(data);
		return { isValid: true, errors: {}, parsedData };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { isValid: false, errors: formatValidationErrors(error) };
		}
		return { isValid: false, errors: { general: "Validation failed" } };
	}
}

/**
 * Helper function to safely parse data with a Zod schema
 */
export function safeParse<T>(
	schema: z.ZodSchema<T>,
	data: unknown,
): { success: true; data: T } | { success: false; error: string } {
	const result = schema.safeParse(data);
	if (result.success) {
		return { success: true, data: result.data };
	} else {
		return { success: false, error: result.error.message };
	}
}

/**
 * Helper function to create a debounced validation function
 */
export function createDebouncedValidator<T>(
	schema: z.ZodSchema<T>,
	delay: number = 300,
): (
	data: unknown,
) => Promise<{ isValid: boolean; errors: Record<string, string> }> {
	let timeoutId: NodeJS.Timeout;

	return (data: unknown) => {
		return new Promise((resolve) => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				const result = validateWithZod(schema, data);
				resolve(result);
			}, delay);
		});
	};
}

/**
 * Helper function to validate email format
 */
export const emailSchema = z
	.string()
	.trim()
	.min(1, "Email is required")
	.max(254, "Email cannot exceed 254 characters")
	.email("Please enter a valid email address")
	.toLowerCase();

/**
 * Helper function to validate phone number format
 */
export const phoneSchema = z
	.string()
	.trim()
	.regex(/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
	.optional();

/**
 * Helper function to validate URL format
 */
export const urlSchema = z
	.string()
	.trim()
	.url("Please enter a valid URL")
	.optional();

/**
 * Helper function to validate date format
 */
export const dateSchema = z
	.string()
	.datetime("Invalid date format")
	.refine(
		(date) => new Date(date) <= new Date(),
		"Date cannot be in the future",
	)
	.optional();
