import { serverApi } from "@/lib/api/server-api"
import type { StoreProductsResponse } from "@/features/product/types/product.types"

/** Fetches the latest published non-featured products for the homepage New Arrivals section. */
export async function getHomeNewArrivals(): Promise<StoreProductsResponse> {
  try {
    return await serverApi.get<StoreProductsResponse>(
      "/store/products/new-arrivals?limit=10",
      { revalidate: 60, timeoutMs: 8_000 }
    )
  } catch (error) {
    console.error("[Home API] Failed to fetch new arrivals.", error)
    return { data: [], total: 0, page: 1, limit: 8, totalPages: 0 }
  }
}

/** Fetches top-selling published products with their complete ordered image galleries. */
export async function getHomeBestSellers(): Promise<StoreProductsResponse> {
  try {
    return await serverApi.get<StoreProductsResponse>(
      "/store/products/best-sellers?limit=6",
      { revalidate: 60, timeoutMs: 8_000 }
    )
  } catch (error) {
    console.error("[Home API] Failed to fetch best sellers.", error)
    return { data: [], total: 0, page: 1, limit: 6, totalPages: 0 }
  }
}
