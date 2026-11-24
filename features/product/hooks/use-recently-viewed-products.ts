"use client"

import { useQuery } from "@tanstack/react-query"

import { baseApi } from "@/lib/api/base-api"
import { useRecentlyViewedStore } from "@/features/product/store/recently-viewed-store"
import type { StoreProductsResponse } from "@/features/product/types/product.types"

export function useRecentlyViewedProducts() {
  // Collect products items of recently viewed product
  const items = useRecentlyViewedStore((state) => state.items)
  // Check is loaded from localstorage
  const hydrated = useRecentlyViewedStore((state) => state.hydrated)
  const productIds = items.map((item) => item.productId)

  return useQuery({
    queryKey: ["recently-viewed-products", productIds],
    queryFn: ({ signal }) =>
      baseApi.post<StoreProductsResponse>(
        "/store/products/recently-viewed",
        { productIds },
        { signal }
      ),
    enabled: hydrated && productIds.length > 0,
    staleTime: 60 * 1000,
    select: (response) => response.data,
  })
}
