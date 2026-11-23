const DEFAULT_NEW_ARRIVAL_DAYS = 30
const DAY_IN_MS = 24 * 60 * 60 * 1000

/**
 * Check whether a product was created within the configured New Arrival period.
 */
export function isNewArrival(
  createdAt?: string | Date | null,
  days = DEFAULT_NEW_ARRIVAL_DAYS
): boolean {
  if (!createdAt || !Number.isFinite(days) || days < 0) {
    return false
  }

  const timestamp = new Date(createdAt).getTime()
  const now = Date.now()

  return (
    Number.isFinite(timestamp) &&
    timestamp <= now &&
    now - timestamp <= days * DAY_IN_MS
  )
}
