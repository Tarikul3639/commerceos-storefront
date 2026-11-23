/**
 * Product + variant identifies one cart line. The same product can still have
 * separate lines when the customer selects different variants.
 */
export function createCartItemKey(productId: string, variantId: string | null): string {
  return `${productId}:${variantId ?? "default"}`
}