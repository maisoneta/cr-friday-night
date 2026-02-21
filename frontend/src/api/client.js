/**
 * Centralized API client for CR Friday Night frontend.
 * Provides shared base URL, headers, and consistent error handling.
 */

import { API_BASE_URL } from '../config';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

/**
 * Low-level request helper. Returns { ok, status, data }.
 * Does not throw for HTTP errors (4xx/5xx) - callers check response.ok/status.
 * Throws for network failures (fetch rejects).
 */
async function request(method, path, body = null) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const opts = { method, headers: DEFAULT_HEADERS };
  if (body !== null && body !== undefined) {
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(url, opts);
  let data = null;
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  }

  return { ok: res.ok, status: res.status, data };
}

/**
 * GET request. Returns { ok, status, data }.
 */
export async function get(path) {
  return request('GET', path);
}

/**
 * POST request. Returns { ok, status, data }.
 */
export async function post(path, body) {
  return request('POST', path, body);
}

/**
 * Extract error message from API response for user display.
 * Uses response.data.message when available, otherwise a generic message.
 */
export function getErrorMessage(response, fallback = 'An error occurred.') {
  if (response?.data?.message) {
    return response.data.message;
  }
  if (response?.status === 404) return 'Not found.';
  if (response?.status >= 500) return 'Server error. Please try again later.';
  return fallback;
}
