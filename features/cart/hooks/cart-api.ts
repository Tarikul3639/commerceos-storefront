import { baseApi } from "@/lib/api/base-api"
import { useCartStore } from "@/features/cart/store/cart-store"
import type { CartItem } from "@/features/cart/types/cart-item"
import type { CartVariantDetails } from "@/features/product/types"
import { createCartItemKey } from "@/features/cart/utils/cart-item-key"

export interface ApiCartItem {
  id: string
  productId: string
  variantId: string | null
  variant: CartVariantDetails | null
  quantity: number
  stock: number
  product: {
    id: string
    name: string
    price: string
    imageUrl: string | null
  }
}

export interface ApiCart {
  items: ApiCartItem[]
}

function isApiCart(value: unknown): value is ApiCart {
  return (
    typeof value === "object" &&
    value !== null &&
    "items" in value &&
    Array.isArray(value.items)
  )
}

function assertApiCart(value: unknown): asserts value is ApiCart {
  if (!isApiCart(value)) {
    throw new Error(
      "Invalid cart response from the server. Expected an object containing an items array."
    )
  }
}

export interface CartStockItem {
  productId: string
  variantId: string | null
  stock: number
}

export interface CartStockResponse {
  items: CartStockItem[]
}

export type AddCartItem = Omit<CartItem, "key" | "serverItemId">

/** Convert the backend cart response into the storefront cart item shape. */
export function mapApiCart({ items }: ApiCart): CartItem[] {
  return items.map((item) => ({
    key: createCartItemKey(item.productId, item.variantId),
    productId: item.productId,
    variantId: item.variantId,
    variant: item.variant
      ? {
          ...item.variant,
          options: item.variant.options ?? [],
        }
      : null,
    quantity: item.quantity,
    stock: item.stock,
    name: item.product.name,
    price: Number(item.product.price),
    imageUrl: item.product.imageUrl,
    serverItemId: item.id,
  }))
}

/** Check whether an API error means the user is not authenticated. */
export function isUnauthorizedError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "status" in error &&
    (error as { status?: number }).status === 401
  )
}

/** Build the request payload expected by the cart API. */
export function toApiCartItem(item: AddCartItem) {
  return {
    productId: item.productId,
    ...(item.variantId ? { variantId: item.variantId } : {}),
    quantity: item.quantity,
  }
}

/** Read only locally persisted cart items that are not owned by the backend. */
export function getGuestItems(): CartItem[] {
  return useCartStore.getState().items.filter((item) => !item.serverItemId)
}

/** Fetch the authenticated cart and migrate any persisted guest items. */
export async function fetchCart(): Promise<CartItem[]> {
  console.debug("[Cart] Fetching cart from backend: GET /cart")

  try {
    let cart: unknown = await baseApi.get<unknown>("/cart")
    assertApiCart(cart)

    console.debug("[Cart] Backend cart fetched:", {
      itemCount: cart.items.length,
      items: cart.items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        stock: item.stock,
      })),
    })

    const guestItems = getGuestItems()

    for (const item of guestItems) {
      await baseApi.post("/cart/items", toApiCartItem(item))
    }

    if (guestItems.length > 0) {
      cart = await baseApi.get<unknown>("/cart")
      assertApiCart(cart)
    }

    const items = mapApiCart(cart)
    useCartStore.getState().setItems(items)
    return items
  } catch (error) {
    console.error("[Cart] Backend cart request failed:", error)

    if (isUnauthorizedError(error)) {
      console.info("[Cart] User is not authenticated; using guest cart")
      return getGuestItems()
    }

    throw error
  }
}
