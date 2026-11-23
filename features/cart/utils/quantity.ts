/** Check whether a quantity is a positive safe integer. */
export function isValidQuantity(quantity: number): boolean {
  return Number.isSafeInteger(quantity) && quantity > 0
}

/**
 * Check whether adding a positive quantity stays within available stock.
 * A current quantity of zero is valid because this is also used for new cart lines.
 */
export function hasAvailableStock(
  currentQuantity: number,
  requestedQuantity: number,
  availableStock: number
): boolean {
  return (
    Number.isSafeInteger(currentQuantity) &&
    currentQuantity >= 0 &&
    isValidQuantity(requestedQuantity) &&
    Number.isSafeInteger(availableStock) &&
    availableStock >= 0 &&
    currentQuantity + requestedQuantity <= availableStock
  )
}
