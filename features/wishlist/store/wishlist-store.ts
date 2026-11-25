import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

interface WishlistState {
  productIds: string[]
  hydrated: boolean
  setHydrated: (hydrated: boolean) => void
  add: (productId: string) => void
  remove: (productId: string) => void
  toggle: (productId: string) => void
  clear: () => void
  setProductIds: (productIds: string[]) => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      productIds: [],
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      add: (productId) =>
        set((state) => ({
          productIds: state.productIds.includes(productId)
            ? state.productIds
            : [...state.productIds, productId],
        })),
      remove: (productId) =>
        set((state) => ({
          productIds: state.productIds.filter((id) => id !== productId),
        })),
      toggle: (productId) =>
        set((state) => ({
          productIds: state.productIds.includes(productId)
            ? state.productIds.filter((id) => id !== productId)
            : [...state.productIds, productId],
        })),
      clear: () => set({ productIds: [] }),
      setProductIds: (productIds) =>
        set({ productIds: [...new Set(productIds)] }),
    }),
    {
      name: "commerceos-wishlist",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ productIds: state.productIds }),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    }
  )
)
