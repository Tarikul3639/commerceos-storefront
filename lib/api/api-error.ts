/**
 * Normalized API error used by both server and browser API clients.
 * Keeps HTTP status and backend error payload available to feature code.
 */
export class ApiError extends Error {
  readonly status: number
  readonly payload: unknown

  constructor(message: string, status: number, payload: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.payload = payload
  }
}

/** Extracts a readable message from common NestJS validation/error responses. */
export function getApiErrorMessage(payload: unknown, fallback: string): string {
  if (typeof payload !== "object" || payload === null) {
    return fallback
  }

  const record = payload as Record<string, unknown>

  if (typeof record.message === "string") {
    return record.message
  }

  if (Array.isArray(record.message)) {
    return record.message
      .filter((item): item is string => typeof item === "string")
      .join(", ")
  }

  if (typeof record.error === "string") {
    return record.error
  }

  return fallback
}
