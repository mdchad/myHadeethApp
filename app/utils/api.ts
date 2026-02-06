import Constants from 'expo-constants'
import { Platform } from 'react-native'

const API_URL = process.env.EXPO_PUBLIC_API_URL
const APP_VERSION = Constants.expoConfig?.version || '1.0.0'
const USER_AGENT = `MyWayApp/${APP_VERSION}`

/**
 * Generic API fetcher with automatic User-Agent header
 * @param endpoint - Full API endpoint path with query params (e.g., '/api/books' or '/api/search?query=test')
 * @param options - Standard fetch options (method, headers, body, etc.)
 * @returns Promise with the response data
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const { headers, ...fetchOptions } = options

  // Build full URL
  const url = `${API_URL}${endpoint}`

  // Merge headers with User-Agent
  const mergedHeaders = {
    'User-Agent': USER_AGENT,
    ...headers,
  }

  // Make the fetch request
  const response = await fetch(url, {
    ...fetchOptions,
    headers: mergedHeaders,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

/**
 * GET request helper
 */
export async function apiGet<T = any>(endpoint: string): Promise<T> {
  return apiFetch<T>(endpoint, { method: 'GET' })
}

/**
 * POST request helper
 */
export async function apiPost<T = any>(
  endpoint: string,
  body?: any
): Promise<T> {
  return apiFetch<T>(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}
