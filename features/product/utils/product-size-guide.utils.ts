import type { ProductSizeGuide } from "../types/product.types"

export function getProductSizeGuide(
  value: Record<string, unknown> | null | undefined
): ProductSizeGuide | null {
  if (!value || !Array.isArray(value.columns) || !Array.isArray(value.rows)) {
    return null
  }

  return value as unknown as ProductSizeGuide
}
