import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import { hasAvailableStock, isValidQuantity } from "../utils/quantity"
import { createCartItemKey } from "../utils/cart-item-key"
import type { CartItem, GuestCartItem } from "../types/cart-item"

const CART_STORAGE_KEY = "commerceos-cart"

interface CartState {
  /** Current cart view; authenticated items are loaded from the backend. */
  items: CartItem[]
  /** Becomes true after Zustand has finished reading persisted guest data. */
  hydrated: boolean

  setHydrated: (hydrated: boolean) => void
  addGuestItem: (item: GuestCartItem) => void
  setItems: (items: CartItem[]) => void
  clear: () => void
  remove: (key: string) => void
  setQuantity: (key: string, quantity: number) => void
}

/**
 * Only guest cart lines belong in browser storage.
 *
 * Authenticated cart contents are owned by the NestJS API and must be fetched
 * again after refresh rather than becoming a second persisted source of truth.
 */
function getPersistedGuestItems(items: CartItem[]): CartItem[] {
  return items.filter((item) => !item.serverItemId)
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      // Initial state of the cart store.
      items: [],
      hydrated: false,

      // Update the hydration flag in the Zustand store.
      setHydrated: (hydrated) => set({ hydrated }),

      // Add a guest item only when the requested quantity is within available stock.
      addGuestItem: (item) => {
        set((state) => {
          if (!isValidQuantity(item.quantity)) {
            return state
          }

          const key = createCartItemKey(item.productId, item.variantId)

          // Match only guest lines; never mutate a backend-owned cart line.
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
                  }
                  : cartItem
              ),
            }
          }

          if (!hasAvailableStock(0, item.quantity, item.stock)) {
            return state
          }

          // Otherwise, add a new guest cart line.
          const newItem: CartItem = {
            key,
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            stock: item.stock,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
          }

          return { items: [...state.items, newItem] }
        })
      },

      // Replace the current cart view, for example with items returned by the backend.
      setItems: (items) => set({ items }),

      // Clear the current cart items. Persist middleware will persist the empty guest cart.
      clear: () => set({ items: [] }),

      // Remove an item from the cart by its frontend cart key.
      remove: (key) => {
        set((state) => ({
          items: state.items.filter((item) => item.key !== key),
        }))
      },

      // Set a guest item's quantity only when it does not exceed available stock.
      setQuantity: (key, quantity) => {
        if (!isValidQuantity(quantity)) {
          return
        }

        set((state) => ({
          items: state.items.map((item) =>
            !item.serverItemId &&
              item.key === key &&
              hasAvailableStock(0, quantity, item.stock)
              ? { ...item, quantity }
              : item
          ),
        }))
      },
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),

      // Persist only guest items (items without a serverItemId) in localStorage.
      partialize: (state) => ({
        items: state.items.filter((item) => !item.serverItemId),
      }),

      // Discard server-owned lines that may exist in data saved by older versions.
      merge: (persistedState, currentState) => {
        const persistedItems = (persistedState as Partial<CartState>).items

        return {
          ...currentState,
          items: Array.isArray(persistedItems)
            ? getPersistedGuestItems(persistedItems)
            : [],
        }
      },

      // Mark hydration complete after persisted state has been restored.
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
)
