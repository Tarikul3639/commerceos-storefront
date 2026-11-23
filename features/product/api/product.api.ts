import { serverApi } from "@/lib/api/server-api"
import type { StoreProductsResponse } from "@/features/product/types/product.types"

export async function getCategoryProducts(
  categoryId: string,
  page = 1,
  limit = 24
): Promise<StoreProductsResponse> {
  try {
    return await serverApi.get<StoreProductsResponse>(
      `/store/products?categoryId=${encodeURIComponent(categoryId)}&page=${page}&limit=${limit}`,
      { revalidate: 60, timeoutMs: 8_000 }
    )
  } catch (error) {
    console.error("[Product API] Failed to fetch category products.", error)
    return { data: [], total: 0, page, limit, totalPages: 0 }
  }
}
