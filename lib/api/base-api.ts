import { ApiError, getApiErrorMessage } from "./api-error"
import type { ApiRequestMethod, ApiRequestOptions } from "./api.types"

const DEFAULT_TIMEOUT_MS = 10_000

/**
 * Shared typed HTTP implementation for server and browser clients.
 * Handles URL joining, JSON bodies, timeouts, credentials and normalized errors.
 */
export function createBaseApi(
  baseUrl: string,
  defaultCredentials: RequestCredentials = "include"
) {
  async function request<T>(
    method: ApiRequestMethod,
    path: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const {
      body,
      timeoutMs = DEFAULT_TIMEOUT_MS,
      revalidate,
      tags,
      headers: requestHeaders,
      signal,
      ...requestOptions
    } = options

    if (!baseUrl) {
      throw new Error(
        "[API] Configure NEXT_PUBLIC_API_URL for browser requests."
      )
    }

    const url = `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`
    const headers = new Headers(requestHeaders)
    headers.set("Accept", "application/json")

    if (body !== undefined && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json")
    }

    const timeoutSignal = AbortSignal.timeout(timeoutMs)
    const requestSignal = signal
      ? AbortSignal.any([signal, timeoutSignal])
      : timeoutSignal

    const response = await fetch(url, {
      ...requestOptions,
      method,
      headers,
      credentials: requestOptions.credentials ?? defaultCredentials,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: requestSignal,
      ...(revalidate !== undefined || tags
        ? { next: { revalidate, tags } }
        : {}),
    })

    if (response.status === 204) {
      return undefined as T
    }

    const contentType = response.headers.get("content-type") ?? ""
    const payload: unknown = contentType.includes("application/json")
      ? await response.json()
      : await response.text()

    if (!response.ok) {
      throw new ApiError(
        getApiErrorMessage(
          payload,
          response.statusText || "API request failed"
        ),
        response.status,
        payload
      )
    }

    return payload as T
  }

  return {
    request,
    get: <T>(path: string, options?: ApiRequestOptions) =>
      request<T>("GET", path, options),
    post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
      request<T>("POST", path, { ...options, body }),
    put: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
      request<T>("PUT", path, { ...options, body }),
    patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) =>
      request<T>("PATCH", path, { ...options, body }),
    delete: <T>(path: string, options?: ApiRequestOptions) =>
      request<T>("DELETE", path, options),
  }
}
