/**
 * A cart line as it is consumed by the storefront.
 *
 * `serverItemId` is present only for items returned by the authenticated Cart API.
 * Guest items intentionally do not have a server ID.
 */
export interface CartItem {
  key: string
  productId: string
  variantId: string | null
  quantity: number
  stock: number
  name: string
  price: number
  imageUrl: string | null
  serverItemId?: string
}

/** Product information required to add an item to a guest cart. */
export type GuestCartItem = Omit<CartItem, "key" | "serverItemId">
