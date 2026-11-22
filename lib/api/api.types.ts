/**
 * Shared options for the Storefront API clients.
 * Next.js cache options are supported only by server-side requests.
 */
export type ApiRequestOptions = Omit<
  RequestInit,
  "body" | "method" | "signal"
> & {
  body?: unknown
  timeoutMs?: number
  revalidate?: number | false
  tags?: string[]
  signal?: AbortSignal
}

export type ApiRequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
