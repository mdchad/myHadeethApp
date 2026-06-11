import Constants from 'expo-constants'

const API_URL = process.env.EXPO_PUBLIC_API_URL
const APP_VERSION = Constants.expoConfig?.version || '1.0.0'
const USER_AGENT = `MyWayApp/${APP_VERSION}`

/**
 * Default request timeout. Vercel functions respond well under this; anything
 * slower is effectively dead air and should fail fast instead of hanging the
 * UI. Callers with known-slow endpoints (semantic search) can override.
 */
const DEFAULT_TIMEOUT_MS = 30_000

/**
 * The device is offline / DNS failed / request timed out. This is expected
 * operational noise — callers (and Sentry filtering) should treat it as
 * "no connection", not as a bug.
 */
export class NetworkError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'NetworkError'
  }
}

/**
 * The server answered but with a non-OK status, or with a body that is not
 * valid JSON (e.g. a captive portal intercepting the request). Carries the
 * HTTP status so retry logic can distinguish 4xx from 5xx.
 */
export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError
}

interface ApiFetchOptions extends RequestInit {
  /** Override the default request timeout (ms). */
  timeoutMs?: number
}

/**
 * Generic API fetcher with automatic User-Agent header
 * @param endpoint - Full API endpoint path with query params (e.g., '/api/books' or '/api/search?query=test')
 * @param options - Standard fetch options (method, headers, body, etc.) plus timeoutMs
 * @returns Promise with the response data
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { headers, timeoutMs = DEFAULT_TIMEOUT_MS, ...fetchOptions } = options

  // Build full URL
  const url = `${API_URL}${endpoint}`

  // Merge headers with User-Agent
  const mergedHeaders = {
    'User-Agent': USER_AGENT,
    ...headers,
  }

  // Bound the request so a flaky connection fails fast instead of hanging
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  let response: Response
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers: mergedHeaders,
      signal: controller.signal,
    })
  } catch (e) {
    // fetch only rejects for connectivity-level failures (offline, DNS,
    // aborted-by-timeout) — surface them as a single expected error type.
    const timedOut = e instanceof Error && e.name === 'AbortError'
    throw new NetworkError(
      timedOut
        ? `Request timed out after ${timeoutMs}ms: ${endpoint}`
        : `Network unavailable: ${endpoint}`,
      e
    )
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    // Keep the legacy "API Error: <status>" prefix — retry logic matches on it.
    throw new ApiError(
      `API Error: ${response.status} ${response.statusText}`,
      response.status
    )
  }

  try {
    return await response.json()
  } catch (e) {
    // 200 with a non-JSON body — typically a captive portal or proxy page.
    throw new ApiError(`API Error: invalid JSON response from ${endpoint}`, response.status)
  }
}

/**
 * GET request helper
 */
export async function apiGet<T = any>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  return apiFetch<T>(endpoint, { ...options, method: 'GET' })
}

/**
 * POST request helper
 */
export async function apiPost<T = any>(
  endpoint: string,
  body?: any,
  options: ApiFetchOptions = {}
): Promise<T> {
  return apiFetch<T>(endpoint, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: JSON.stringify(body),
  })
}
