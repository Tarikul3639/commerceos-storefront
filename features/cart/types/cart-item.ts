import type { CartVariantDetails } from "@/features/product/types/product.types"

/**
 * A cart line as it is consumed by the storefront.
 *
 * Product + variant identifies a line. Variant metadata is retained for both
 * persisted guest carts and API-owned authenticated carts.
 */
export interface CartItem {
  key: string
  productId: string
  variantId: string | null
  variant: CartVariantDetails | null
  quantity: number
  stock: number
  name: string
  price: number
  imageUrl: string | null
  serverItemId?: string
}

/** Product information required to add an item to a guest cart. */
export type GuestCartItem = Omit<CartItem, "key" | "serverItemId">

export type { CartVariantDetails }
