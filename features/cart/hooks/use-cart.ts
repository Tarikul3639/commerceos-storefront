"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

import { clientApi } from "@/lib/api/client-api"
import { useCartStore } from "@/features/cart/store/cart-store"
import type { CartItem } from "@/features/cart/types/cart-item"

let cartSyncInFlight = false

interface ApiCartItem {
  id: string
  productId: string
  variantId: string | null
  quantity: number
  stock: number
  product: {
    id: string
    name: string
    price: string
    imageUrl: string | null
  }
}

interface ApiCart {
  items: ApiCartItem[]
}

type AddCartItem = Omit<CartItem, "key" | "serverItemId">

function mapApiCart(cart: ApiCart): CartItem[] {
  return cart.items.map((item) => ({
    key: `${item.productId}:${item.variantId ?? "default"}`,
    productId: item.productId,
    variantId: item.variantId,
    quantity: item.quantity,
    stock: item.stock,
    name: item.product.name,
    price: Number(item.product.price),
    imageUrl: item.product.imageUrl,
    serverItemId: item.id,
  }))
}

function isUnauthorizedError(error: unknown): boolean {
  return (
    error instanceof Error &&
    "status" in error &&
    (error as { status?: number }).status === 401
  )
}

function toApiCartItem(item: AddCartItem) {
  return {
    productId: item.productId,
    ...(item.variantId ? { variantId: item.variantId } : {}),
    quantity: item.quantity,
  }
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
      const remoteCart = await clientApi.get<ApiCart>("/cart")
      const guestItems = useCartStore
        .getState()
        .items.filter((item) => !item.serverItemId)

      for (const item of guestItems) {
        await clientApi.post("/cart/items", toApiCartItem(item))
      }

      const cart =
        guestItems.length > 0
          ? await clientApi.get<ApiCart>("/cart")
          : remoteCart

      setItems(mapApiCart(cart))
    } catch {
      // Keep the persisted guest cart when the account is unavailable.
    } finally {
      cartSyncInFlight = false
    }
  }, [hydrated, setItems])

  useEffect(() => {
    void syncWithAccount()

    const handleFocus = () => {
      void syncWithAccount()
    }

    window.addEventListener("focus", handleFocus)

    return () => {
      window.removeEventListener("focus", handleFocus)
    }
  }, [pathname, syncWithAccount])

  const addItem = useCallback(
    async (item: AddCartItem) => {
      setIsAdding(true)

      try {
        const cart = await clientApi.post<ApiCart>(
          "/cart/items",
          toApiCartItem(item)
        )

        setItems(mapApiCart(cart))
      } catch (error) {
        if (isUnauthorizedError(error)) {
          addGuestItem(item)
          return
        }

        throw error
      } finally {
        setIsAdding(false)
      }
    },
    [addGuestItem, setItems]
  )

  const removeItem = useCallback(
    async (item: CartItem) => {
      if (!item.serverItemId) {
        remove(item.key)
        return
      }

      const cart = await clientApi.delete<ApiCart>(
        `/cart/items/${item.serverItemId}`
      )

      setItems(mapApiCart(cart))
    },
    [remove, setItems]
  )

  const updateQuantity = useCallback(
    async (item: CartItem, quantity: number) => {
      if (quantity < 1) return

      if (!item.serverItemId) {
        setQuantity(item.key, quantity)
        return
      }

      const cart = await clientApi.patch<ApiCart>(
        `/cart/items/${item.serverItemId}`,
        { quantity }
      )

      setItems(mapApiCart(cart))
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
    totalItems: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
  }
}
