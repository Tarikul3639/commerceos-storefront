import type {
  StoreProductDetailResponse,
  StoreProductVariant,
} from "../types/product.types"
import type { ProductSelection } from "../types/product.types"

export function matchesProductVariantSelection(
  variant: StoreProductVariant,
  selection: ProductSelection
) {
  return Object.entries(selection).every(([optionId, valueId]) =>
    variant.options.some(
      (option) => option.optionId === optionId && option.id === valueId
    )
  )
}

export function hasAvailableProductVariant(
  data: StoreProductDetailResponse,
  selection: ProductSelection,
  optionId: string,
  valueId: string
) {
  const nextSelection = { ...selection, [optionId]: valueId }

  return data.variants.some(
    (variant) =>
      variant.isAvailable &&
      variant.stock > 0 &&
      data.options.every(
        (option) =>
          !nextSelection[option.id] ||
          variant.options.some(
            (item) =>
              item.optionId === option.id &&
              item.id === nextSelection[option.id]
          )
      )
  )
}
