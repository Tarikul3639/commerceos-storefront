import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import { hasAvailableStock, isValidQuantity } from "../utils/quantity"
import { createCartItemKey } from "../utils/cart-item-key"
import type { CartItem, GuestCartItem } from "../types/cart-item"

const CART_STORAGE_KEY = "commerceos-cart"

interface CartState {
  items: CartItem[]
  hydrated: boolean
  setHydrated: (hydrated: boolean) => void
  addGuestItem: (item: GuestCartItem) => void
  setItems: (items: CartItem[]) => void
  updateStock: (
    stockItems: Array<{
      productId: string
      variantId: string | null
      stock: number
    }>
  ) => void
  clear: () => void
  remove: (key: string) => void
  setQuantity: (key: string, quantity: number) => void
}

function getPersistedGuestItems(items: CartItem[]): CartItem[] {
  return items
    .filter((item) => !item.serverItemId)
    .map((item) => ({
      ...item,
      variant: item.variant ?? null,
    }))
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),

      addGuestItem: (item) => {
        set((state) => {
          if (!isValidQuantity(item.quantity)) return state

          const key = createCartItemKey(item.productId, item.variantId)
          const existingGuestItem = state.items.find(
            (existingItem) =>
              !existingItem.serverItemId && existingItem.key === key
          )

          if (existingGuestItem) {
            if (
              !hasAvailableStock(
                existingGuestItem.quantity,
                item.quantity,
                item.stock
              )
            ) {
              return state
            }

            return {
              items: state.items.map((cartItem) =>
                !cartItem.serverItemId && cartItem.key === key
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity + item.quantity,
                      stock: item.stock,
                      variant: item.variant,
                    }
                  : cartItem
              ),
            }
          }

          if (!hasAvailableStock(0, item.quantity, item.stock)) return state

          const newItem: CartItem = {
            key,
            productId: item.productId,
            variantId: item.variantId,
            variant: item.variant,
            quantity: item.quantity,
            stock: item.stock,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
          }

          return { items: [...state.items, newItem] }
        })
      },

      setItems: (items) => set({ items }),

      updateStock: (stockItems) => {
        const stockByKey = new Map(
          stockItems.map((stockItem) => [
            createCartItemKey(stockItem.productId, stockItem.variantId),
            stockItem.stock,
          ])
        )

        set((state) => ({
          items: state.items.map((item) => {
            const stock = stockByKey.get(item.key)
            return stock === undefined ? item : { ...item, stock }
          }),
        }))
      },

      clear: () => set({ items: [] }),

      remove: (key) => {
        set((state) => ({
          items: state.items.filter((item) => item.key !== key),
        }))
      },

      setQuantity: (key, quantity) => {
        if (!isValidQuantity(quantity)) return

        set((state) => ({
          items: state.items.map((item) =>
            !item.serverItemId &&
            item.key === key &&
            (quantity <= item.quantity ||
              hasAvailableStock(0, quantity, item.stock))
              ? { ...item, quantity }
              : item
          ),
        }))
      },
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items.filter((item) => !item.serverItemId),
      }),
      merge: (persistedState, currentState) => {
        const persistedItems = (persistedState as Partial<CartState>).items

        return {
          ...currentState,
          items: Array.isArray(persistedItems)
            ? getPersistedGuestItems(persistedItems)
            : [],
        }
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
)
