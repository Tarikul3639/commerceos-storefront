import type { StoreProductVariant } from "@/features/product/types"

export type ProductVariantSelection = Record<string, string>

export function matchesVariantSelection(
  variant: StoreProductVariant,
  selection: ProductVariantSelection
) {
  return Object.entries(selection).every(([optionId, valueId]) =>
    variant.options.some(
      (option) => option.optionId === optionId && option.id === valueId
    )
  )
}

// Keep an option value selectable only when it can still form a purchasable variant.
export function isVariantValueAvailable(
  variants: StoreProductVariant[],
  selection: ProductVariantSelection,
  optionId: string,
  valueId: string
) {
  return variants.some(
    (variant) =>
      variant.isAvailable &&
      variant.stock > 0 &&
      matchesVariantSelection(variant, { ...selection, [optionId]: valueId })
  )
}

// Centralize stock feedback so the dialog uses consistent messages for every variant.
export function getVariantStockMessage(
  remainingStock: number,
  quantityInCart: number,
  availableStock: number
) {
  if (remainingStock < 1) {
    return quantityInCart > 0
      ? "You've already added the maximum available stock of this variant to your cart."
      : "This product is currently out of stock."
  }
  if (quantityInCart > 0) {
    return `You already have ${quantityInCart} in your cart. Only ${remainingStock} more can be added.`
  }
  return `Only ${availableStock} in stock.`
}
