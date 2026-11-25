import { useMutation } from "@tanstack/react-query"

import { baseApi } from "@/lib/api/base-api"
import { useCartStore } from "@/features/cart/store/cart-store"
import type { CartItem } from "@/features/cart/types/cart-item"
import { createCartItemKey } from "@/features/cart/utils/cart-item-key"
import {
  isUnauthorizedError,
  mapApiCart,
  toApiCartItem,
  type AddCartItem,
  type ApiCart,
} from "./cart-api"

/** Encapsulate cart write operations and keep Zustand synchronized with API responses. */
export function useCartMutations() {
  const addGuestItem = useCartStore((state) => state.addGuestItem)
  const removeGuestItem = useCartStore((state) => state.remove)
  const updateGuestQuantity = useCartStore((state) => state.setQuantity)
  const setItems = useCartStore((state) => state.setItems)

  const addMutation = useMutation({
    mutationFn: async (item: AddCartItem) => {
      const key = createCartItemKey(item.productId, item.variantId)
      const existingQuantity = useCartStore
        .getState()
        .items.filter((cartItem) => cartItem.key === key)
        .reduce((total, cartItem) => total + cartItem.quantity, 0)
      const acceptedQuantity = Math.min(
        item.quantity,
        Math.max(0, item.stock - existingQuantity)
      )

      if (acceptedQuantity < 1) {
        throw new Error("Maximum available stock is already in your cart")
      }

      const acceptedItem = { ...item, quantity: acceptedQuantity }

      try {
        const cart = await baseApi.post<ApiCart>(
          "/cart/items",
          toApiCartItem(acceptedItem)
        )

        return {
          items: mapApiCart(cart),
          acceptedQuantity,
        }
      } catch (error) {
        if (!isUnauthorizedError(error)) throw error

        addGuestItem(acceptedItem)
        return {
          items: useCartStore.getState().items,
          acceptedQuantity,
        }
      }
    },
    onSuccess: ({ items: updatedItems }) => setItems(updatedItems),
  })

  const removeMutation = useMutation({
    mutationFn: async (item: CartItem) => {
      if (!item.serverItemId) {
        removeGuestItem(item.key)
        return useCartStore.getState().items
      }

      const cart = await baseApi.delete<ApiCart>(
        `/cart/items/${item.serverItemId}`
      )
      return mapApiCart(cart)
    },
    onSuccess: setItems,
  })

  const updateMutation = useMutation({
    mutationFn: async ({
      item,
      quantity,
    }: {
      item: CartItem
      quantity: number
    }) => {
      if (quantity < 1) return useCartStore.getState().items

      if (!item.serverItemId) {
        updateGuestQuantity(item.key, quantity)
        return useCartStore.getState().items
      }

      const cart = await baseApi.patch<ApiCart>(
        `/cart/items/${item.serverItemId}`,
        { quantity }
      )
      return mapApiCart(cart)
    },
    onSuccess: setItems,
  })

  return {
    isAdding: addMutation.isPending,
    addItem: async (item: AddCartItem) => {
      const result = await addMutation.mutateAsync(item)
      return result.acceptedQuantity
    },
    removeItem: async (item: CartItem) => {
      await removeMutation.mutateAsync(item)
    },
    updateQuantity: async (item: CartItem, quantity: number) => {
      await updateMutation.mutateAsync({ item, quantity })
    },
  }
}
