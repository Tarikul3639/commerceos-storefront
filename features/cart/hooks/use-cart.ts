"use client"

import { useQuery } from "@tanstack/react-query"

import { useCartStore } from "@/features/cart/store/cart-store"
import type { CartItem } from "@/features/cart/types/cart-item"
import { fetchCart } from "./cart-api"
import { useCartMutations } from "./use-cart-mutations"
import { useCartStock } from "./use-cart-stock"

export const CART_QUERY_KEY = ["cart"] as const

/** Expose cart state and mutations while keeping Zustand as the UI state source. */
export function useCart() {
  const hydrated = useCartStore((state) => state.hydrated)
  const items = useCartStore((state) => state.items)

  console.debug("[Cart] Zustand hydrated:", hydrated)

  const { isLoading } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchCart,
    enabled: hydrated,
    refetchOnWindowFocus: true,
  })

  useCartStock({ hydrated, items })

  const mutations = useCartMutations()

  return {
    items,
    hydrated,
    isAdding: mutations.isAdding,
    isLoading,
    addItem: mutations.addItem,
    removeItem: async (item: CartItem) => {
      await mutations.removeItem(item)
    },
    updateQuantity: async (item: CartItem, quantity: number) => {
      await mutations.updateQuantity(item, quantity)
    },
    totalItems: items.reduce((total, item) => total + item.quantity, 0),
    subtotal: items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
  }
}
