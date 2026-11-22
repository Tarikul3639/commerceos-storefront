"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export interface CartItem {
  key: string
  productId: string
  variantId: string | null
  quantity: number
  name: string
  price: number
  imageUrl: string | null
  serverItemId?: string
}

interface CartState {
  items: CartItem[]
  hydrated: boolean
  setHydrated: (hydrated: boolean) => void
  addGuestItem: (item: Omit<CartItem, "key" | "serverItemId">) => void
  setItems: (items: CartItem[]) => void
  clear: () => void
  remove: (key: string) => void
  setQuantity: (key: string, quantity: number) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      addGuestItem: (item) =>
        set((state) => {
          const key = `${item.productId}:${item.variantId ?? "default"}`
          const existing = state.items.find((entry) => entry.key === key)
          return {
            items: existing
              ? state.items.map((entry) =>
                  entry.key === key
                    ? { ...entry, quantity: entry.quantity + item.quantity }
                    : entry
                )
              : [...state.items, { ...item, key }],
          }
        }),
      setItems: (items) => set({ items }),
      clear: () => set({ items: [] }),
      remove: (key) =>
        set((state) => ({
          items: state.items.filter((item) => item.key !== key),
        })),
      setQuantity: (key, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.key === key
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),
    }),
    {
      name: "commerceos-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    }
  )
)
