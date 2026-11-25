import { serverApi } from "@/lib/api/server-api"
import type { StoreProductsResponse } from "@/features/product/types/product.types"

export type StoreProductFilters = {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  brandId?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  isFeatured?: boolean
  sortBy?: "createdAt" | "name" | "sellingPrice"
  sortOrder?: "asc" | "desc"
}

/** Fetch a shareable, server-rendered product listing using the public catalog filters. */
export async function getStoreProducts(
  filters: StoreProductFilters = {}
): Promise<StoreProductsResponse> {
  const params = new URLSearchParams()

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "" && value !== false) {
      params.set(key, String(value))
    }
  }

  try {
    return await serverApi.get<StoreProductsResponse>(
      `/store/products?${params.toString()}`,
      { revalidate: 60, timeoutMs: 8_000 }
    )
  } catch (error) {
    console.error("[Product API] Failed to fetch store products.", error)
    return {
      data: [],
      total: 0,
      page: filters.page ?? 1,
      limit: filters.limit ?? 24,
      totalPages: 0,
    }
  }
}

export async function getCategoryProducts(
  categoryId: string,
  page = 1,
  limit = 24
): Promise<StoreProductsResponse> {
  return getStoreProducts({ categoryId, page, limit })
}
