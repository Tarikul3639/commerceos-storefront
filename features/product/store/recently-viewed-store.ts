import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const RECENTLY_VIEWED_STORAGE_KEY = "commerceos-recently-viewed"
const MAX_RECENTLY_VIEWED_ITEMS = 20

export interface RecentlyViewedItem {
  productId: string
  viewedAt: string
}

interface RecentlyViewedState {
  items: RecentlyViewedItem[]
  hydrated: boolean
  addProduct: (productId: string) => void
  clearHistory: () => void
  setHydrated: (hydrated: boolean) => void
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,

      addProduct: (productId) => {
        if (!productId.trim()) return

        set((state) => ({
          items: [
            { productId, viewedAt: new Date().toISOString() },
            ...state.items.filter((item) => item.productId !== productId),
          ].slice(0, MAX_RECENTLY_VIEWED_ITEMS),
        }))
      },

      clearHistory: () => set({ items: [] }),
      setHydrated: (hydrated) => set({ hydrated }),
    }),
    {
      name: RECENTLY_VIEWED_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      merge: (persistedState, currentState) => {
        const persistedItems = (persistedState as Partial<RecentlyViewedState>)
          .items

        return {
          ...currentState,
          items: Array.isArray(persistedItems)
            ? persistedItems
                .filter(
                  (item) =>
                    typeof item.productId === "string" &&
                    typeof item.viewedAt === "string"
                )
                .slice(0, MAX_RECENTLY_VIEWED_ITEMS)
            : [],
        }
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
)
