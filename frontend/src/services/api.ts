/**
 * Central API Client for Motor Doctor Frontend
 * Handles dynamic base URLs for both local development and Render production
 */

// Dynamic base URL resolution
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }
  // When running locally under Vite dev server, relative '/api' is forwarded by Vite proxy to localhost:5000
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
  user?: any;
  token?: string;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = API_BASE_URL;
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const defaultHeaders: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  // Attach token if stored
  const token = localStorage.getItem('md_auth_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
  } catch (err: any) {
    console.error(`[API Error] Request failed to ${url}:`, err);
    throw new Error(
      err?.name === 'TypeError' || err?.message === 'Failed to fetch'
        ? `Motor Doctor server connection failed. Please ensure the backend is running on port 5000.`
        : err?.message || 'Network request failed'
    );
  }

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const errorJson = await response.json();
      errorMessage = errorJson.message || errorJson.error || errorMessage;
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMessage);
  }

  // If 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  try {
    return await response.json();
  } catch {
    return {} as T;
  }
}

function prepareBody(body?: any): BodyInit | undefined {
  if (body === undefined || body === null) return undefined;
  if (typeof FormData !== 'undefined' && body instanceof FormData) return body;
  if (typeof body === 'string') return body;
  return JSON.stringify(body);
}

export const api = {
  get: <T = any>(url: string, options?: RequestInit) =>
    apiRequest<T>(url, { ...options, method: 'GET' }),
  post: <T = any>(url: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(url, {
      ...options,
      method: 'POST',
      body: prepareBody(body),
    }),
  put: <T = any>(url: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(url, {
      ...options,
      method: 'PUT',
      body: prepareBody(body),
    }),
  patch: <T = any>(url: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(url, {
      ...options,
      method: 'PATCH',
      body: prepareBody(body),
    }),
  delete: <T = any>(url: string, options?: RequestInit) =>
    apiRequest<T>(url, { ...options, method: 'DELETE' }),
};

export default api;
