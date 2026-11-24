"use client"

import { useEffect } from "react"
import { useRecentlyViewedStore } from "@/features/product/store/recently-viewed-store"

export function RecentlyViewedTracker({ productId }: { productId: string }) {
  const addProduct = useRecentlyViewedStore((state) => state.addProduct)

  useEffect(() => {
    addProduct(productId)
  }, [addProduct, productId])

  return null
}
