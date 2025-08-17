import { z } from "zod";

export const ThemeSchema = z.enum(["light", "dark", "system"], {
	message: "Theme must be light, dark, or system",
});

export const DateFormatSchema = z.enum(
	["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"],
	{
		message: "Invalid date format",
	},
);

export const TimeFormatSchema = z.enum(["12h", "24h"], {
	message: "Time format must be 12h or 24h",
});

export const CurrencySchema = z.enum(["USD", "EUR", "GBP", "CAD", "AUD"], {
	message: "Invalid currency code",
});

export const NotificationSchema = z.object({
	email: z.boolean().default(true),
	push: z.boolean().default(true),
	sms: z.boolean().default(false),
	sound: z.boolean().default(true),
});

export const PrivacySchema = z.object({
	shareAnalytics: z.boolean().default(false),
	allowCookies: z.boolean().default(true),
	dataRetention: z
		.enum(["30days", "90days", "1year", "forever"], {
			message: "Invalid data retention period",
		})
		.default("1year"),
});

export const DisplaySchema = z.object({
	compactMode: z.boolean().default(false),
	showAvatars: z.boolean().default(true),
	showTimestamps: z.boolean().default(true),
	itemsPerPage: z
		.number()
		.int("Items per page must be a whole number")
		.min(10, "Items per page must be at least 10")
		.max(100, "Items per page cannot exceed 100")
		.default(20),
});

export const ApplicationSettingsSchema = z.object({
	theme: ThemeSchema.default("system"),
	language: z
		.string()
		.min(2, "Language code must be at least 2 characters")
		.max(5, "Language code cannot exceed 5 characters")
		.default("en"),
	dateFormat: DateFormatSchema.default("MM/DD/YYYY"),
	timeFormat: TimeFormatSchema.default("12h"),
	currency: CurrencySchema.default("USD"),
	timezone: z.string().default("UTC"),
	notifications: NotificationSchema,
	privacy: PrivacySchema,
	display: DisplaySchema,
	features: z.object({
		advancedAnalytics: z.boolean().default(false),
		teamCollaboration: z.boolean().default(true),
		apiAccess: z.boolean().default(false),
		exportOptions: z.boolean().default(true),
	}),
	preferences: z.object({
		autoSave: z.boolean().default(true),
		autoRefresh: z.boolean().default(true),
		confirmDeletions: z.boolean().default(true),
		showTutorials: z.boolean().default(true),
	}),
});

export const UserProfileSchema = z.object({
	firstName: z
		.string()
		.trim()
		.min(1, "First name is required")
		.max(50, "First name cannot exceed 50 characters")
		.regex(
			/^[a-zA-Z\s\-'.]+$/,
			"First name can only contain letters, spaces, hyphens, apostrophes, and periods",
		),
	lastName: z
		.string()
		.trim()
		.min(1, "Last name is required")
		.max(50, "Last name cannot exceed 50 characters")
		.regex(
			/^[a-zA-Z\s\-'.]+$/,
			"Last name can only contain letters, spaces, hyphens, apostrophes, and periods",
		),
	email: z
		.string()
		.trim()
		.min(1, "Email is required")
		.max(254, "Email cannot exceed 254 characters")
		.email("Please enter a valid email address")
		.toLowerCase(),
	phone: z
		.string()
		.trim()
		.regex(/^[+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
		.optional(),
	avatar: z.string().url("Avatar must be a valid URL").optional(),
	timezone: z.string().default("UTC"),
	language: z
		.string()
		.min(2, "Language code must be at least 2 characters")
		.max(5, "Language code cannot exceed 5 characters")
		.default("en"),
});

export type Theme = z.infer<typeof ThemeSchema>;
export type DateFormat = z.infer<typeof DateFormatSchema>;
export type TimeFormat = z.infer<typeof TimeFormatSchema>;
export type Currency = z.infer<typeof CurrencySchema>;
export type NotificationSettings = z.infer<typeof NotificationSchema>;
export type PrivacySettings = z.infer<typeof PrivacySchema>;
export type DisplaySettings = z.infer<typeof DisplaySchema>;
export type ApplicationSettings = z.infer<typeof ApplicationSettingsSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;

/**
 * Default application settings
 */
export const DEFAULT_APPLICATION_SETTINGS: ApplicationSettings = {
	theme: "system",
	language: "en",
	dateFormat: "MM/DD/YYYY",
	timeFormat: "12h",
	currency: "USD",
	timezone: "UTC",
	notifications: {
		email: true,
		push: true,
		sms: false,
		sound: true,
	},
	privacy: {
		shareAnalytics: false,
		allowCookies: true,
		dataRetention: "1year",
	},
	display: {
		compactMode: false,
		showAvatars: true,
		showTimestamps: true,
		itemsPerPage: 20,
	},
	features: {
		advancedAnalytics: false,
		teamCollaboration: true,
		apiAccess: false,
		exportOptions: true,
	},
	preferences: {
		autoSave: true,
		autoRefresh: true,
		confirmDeletions: true,
		showTutorials: true,
	},
};

/**
 * Helper function to validate and merge settings with defaults
 */
export function createApplicationSettings(
	settings: Partial<ApplicationSettings>,
): ApplicationSettings {
	const validatedSettings = ApplicationSettingsSchema.parse(settings);
	return { ...DEFAULT_APPLICATION_SETTINGS, ...validatedSettings };
}

/**
 * Helper function to validate user profile data
 */
export function validateUserProfile(profile: unknown): {
	isValid: boolean;
	errors: Record<string, string>;
	data?: UserProfile;
} {
	try {
		const data = UserProfileSchema.parse(profile);
		return { isValid: true, errors: {}, data };
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errors: Record<string, string> = {};
			error.issues.forEach((issue) => {
				const field = issue.path[0] as string;
				errors[field] = issue.message;
			});
			return { isValid: false, errors };
		}
		return { isValid: false, errors: { general: "Profile validation failed" } };
	}
}
