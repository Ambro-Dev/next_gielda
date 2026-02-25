import axios from "axios";

// Check if we're in build mode or if external APIs are disabled
const isBuildMode = process.env.BUILD_MODE === "true" || process.env.NEXT_PUBLIC_DISABLE_EXTERNAL_APIS === "true";

// Get the base URL, defaulting to localhost if not set
const getBaseURL = () => {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  
  // If we're in build mode, use localhost to prevent external calls during build
  if (isBuildMode) {
    return "http://localhost:3000";
  }
  
  // For client-side requests, always use the configured server URL or current origin
  if (typeof window !== 'undefined') {
    // Use the configured server URL if available, otherwise use current origin
    if (serverUrl) {
      return serverUrl;
    }
    // Fallback to current origin for client-side requests
    return window.location.origin;
  }
  
  // For server-side requests, always use localhost to avoid routing issues
  return "http://localhost:3000";
};

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: isBuildMode ? 1000 : 120000, // Short timeout during build, 2min for bulk operations
});

// Override baseURL for client-side requests
if (typeof window !== 'undefined') {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  // Always use the configured server URL for client-side requests
  if (serverUrl) {
    axiosInstance.defaults.baseURL = serverUrl;
  } else {
    // Fallback to current origin if no server URL is configured
    axiosInstance.defaults.baseURL = window.location.origin;
  }
}

// Server-side: forward cookies for authenticated API calls
if (typeof window === 'undefined') {
  axiosInstance.interceptors.request.use(async (config) => {
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const cookieHeader = cookieStore.getAll().map((c: { name: string; value: string }) => `${c.name}=${c.value}`).join('; ');
      if (cookieHeader) {
        config.headers.Cookie = cookieHeader;
      }
    } catch {
      // Not in a request context (e.g., build time)
    }
    return config;
  });
}

// Add request interceptor to prevent external API calls during build
axiosInstance.interceptors.request.use(
  (config) => {
    if (isBuildMode) {
      // Block external API calls during build to prevent connection errors
      // But allow internal API calls (same origin)
      const isInternalCall = config.url?.startsWith('/api/') || config.url?.startsWith('/');
      if (!isInternalCall) {
        throw new Error('External API calls disabled during build');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
