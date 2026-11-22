import { serverApi } from "@/lib/api/server-api"
import type { StoreProductsResponse } from "@/features/categories/api/product.api"

/** Fetch published products manually selected for the homepage. */
export async function getHomeFeaturedProducts(): Promise<StoreProductsResponse> {
  try {
    return await serverApi.get<StoreProductsResponse>(
      "/store/products?isFeatured=true&limit=8",
      { revalidate: 60, timeoutMs: 8_000 }
    )
  } catch (error) {
    console.error("[Product API] Failed to fetch homepage featured products.", error)
    return { data: [], total: 0, page: 1, limit: 8, totalPages: 0 }
  }
}
