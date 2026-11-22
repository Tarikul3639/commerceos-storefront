import { serverApi } from "@/lib/api/server-api"
import type { StoreProductsResponse } from "@/features/categories/api/product.api"

/** Fetches the latest published non-featured products for the homepage New Arrivals section. */
export async function getHomeNewArrivals(): Promise<StoreProductsResponse> {
  try {
    return await serverApi.get<StoreProductsResponse>(
      "/store/products/new-arrivals?limit=8",
      { revalidate: 60, timeoutMs: 8_000 }
    )
  } catch (error) {
    console.error("[Home API] Failed to fetch new arrivals.", error)
    return { data: [], total: 0, page: 1, limit: 8, totalPages: 0 }
  }
}