// Legacy API file - now using clean architecture
// This file is kept for backward compatibility but delegates to the new HTTP client

import { apiService } from "@/domain/infra/http";

// Export the new HTTP client for backward compatibility
export const api = apiService;
