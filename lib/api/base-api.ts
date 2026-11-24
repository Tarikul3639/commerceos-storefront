import { ApiError, getApiErrorMessage } from "./api-error"
import type { ApiRequestMethod, ApiRequestOptions } from "./api.types"

const DEFAULT_TIMEOUT_MS = 10_000

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:5000/api/v1" : "")

export function createBaseApi(
  baseUrl: string,
  credentials: RequestCredentials = "include"
) {
  async function request<T>(
    method: ApiRequestMethod,
    path: string,
    options: ApiRequestOptions = {}
  ): Promise<T> {
    if (!baseUrl) {
      throw new Error("[API] API base URL is not configured.")
    }

    const {
      body,
      timeoutMs = DEFAULT_TIMEOUT_MS,
      headers,
      signal,
      revalidate,
      tags,
      ...rest
    } = options

    const response = await fetch(
      `${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`,
      {
        ...rest,
        method,
        credentials: rest.credentials ?? credentials,
        headers: {
          Accept: "application/json",
          ...(body !== undefined && { "Content-Type": "application/json" }),
          ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.any([
          ...(signal ? [signal] : []),
          AbortSignal.timeout(timeoutMs),
        ]),
        ...(revalidate !== undefined || tags
          ? { next: { revalidate, tags } }
          : {}),
      }
    )

    if (response.status === 204) return undefined as T

    const contentType = response.headers.get("content-type") ?? ""
    const data: unknown = contentType.includes("application/json")
      ? await response.json()
      : await response.text()

    if (!response.ok) {
      throw new ApiError(
        getApiErrorMessage(data, response.statusText || "API request failed"),
        response.status,
        data
      )
    }

    return data as T
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

/** Browser API transport. */
export const baseApi = createBaseApi(API_BASE_URL)
