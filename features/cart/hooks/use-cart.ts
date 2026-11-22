"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { clientApi } from "@/lib/api/client-api"
import { useCartStore, type CartItem } from "@/features/cart/store/cart-store"

let cartSyncInFlight = false

interface ApiCart {
  items: Array<{
    id: string
    productId: string
    variantId: string | null
    quantity: number
    product: {
      id: string
      name: string
      price: string
      imageUrl: string | null
    }
  }>
}

function mapApiCart(cart: ApiCart): CartItem[] {
  return cart.items.map((item) => ({
    key: `${item.productId}:${item.variantId ?? "default"}`,
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity,
    name: item.product.name,
    price: Number(item.product.price),
    imageUrl: item.product.imageUrl,
    serverItemId: item.id,
  }))
}

export function useCart() {
  const items = useCartStore((state) => state.items)
  const hydrated = useCartStore((state) => state.hydrated)
  const addGuestItem = useCartStore((state) => state.addGuestItem)
  const setItems = useCartStore((state) => state.setItems)
  const remove = useCartStore((state) => state.remove)
  const setQuantity = useCartStore((state) => state.setQuantity)
  const [isAdding, setIsAdding] = useState(false)
  const pathname = usePathname()

  const syncWithAccount = useCallback(async () => {
    if (!hydrated || cartSyncInFlight) return
    cartSyncInFlight = true
    try {
      const remote = await clientApi.get<ApiCart>("/cart")
      const guestItems = useCartStore
        .getState()
        .items.filter((item) => !item.serverItemId)
      for (const item of guestItems) {
        await clientApi.post("/cart/items", {
          productId: item.productId,
          ...(item.variantId ? { variantId: item.variantId } : {}),
          quantity: item.quantity,
        })
      }
      const refreshed = guestItems.length
        ? await clientApi.get<ApiCart>("/cart")
        : remote
      setItems(mapApiCart(refreshed))
    } catch {
      // Guest sessions keep their persisted local cart when the API returns 401.
    } finally {
      cartSyncInFlight = false
    }
  }, [hydrated, setItems])

  useEffect(() => {
    void syncWithAccount()
    const handleFocus = () => void syncWithAccount()
    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [pathname, syncWithAccount])

  const addItem = useCallback(
    async (item: Omit<CartItem, "key" | "serverItemId">) => {
      setIsAdding(true)
      try {
        const remote = await clientApi.post<ApiCart>("/cart/items", {
          productId: item.productId,
          ...(item.variantId ? { variantId: item.variantId } : {}),
          quantity: item.quantity,
        })
        setItems(mapApiCart(remote))
      } catch (error) {
        if (
          error instanceof Error &&
          "status" in error &&
          (error as { status?: number }).status === 401
        ) {
          addGuestItem(item)
        } else {
          throw error
        }
      } finally {
        setIsAdding(false)
      }
    },
    [addGuestItem, setItems]
  )

  const removeItem = useCallback(
    async (item: CartItem) => {
      if (item.serverItemId) {
        const updated = await clientApi.delete<ApiCart>(
          `/cart/items/${item.serverItemId}`
        )
        setItems(mapApiCart(updated))
      } else {
        remove(item.key)
      }
    },
    [remove, setItems]
  )

  const updateQuantity = useCallback(
    async (item: CartItem, quantity: number) => {
      if (quantity < 1) return
      if (item.serverItemId) {
        const updated = await clientApi.patch<ApiCart>(
          `/cart/items/${item.serverItemId}`,
          { quantity }
        )
        setItems(mapApiCart(updated))
      } else {
        setQuantity(item.key, quantity)
      }
    },
    [setItems, setQuantity]
  )

  return {
    items,
    hydrated,
    isAdding,
    addItem,
    removeItem,
    updateQuantity,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }
}
