import { serverApi } from "@/lib/api/server-api"
import type {
  StoreCategoriesResponse,
  StoreCategory,
} from "@/features/home/types/category.types"

export async function getStoreCategories(
  page = 1,
  limit = 24
): Promise<StoreCategoriesResponse> {
  try {
    return await serverApi.get<StoreCategoriesResponse>(
      `/categories?isActive=true&page=${page}&limit=${limit}`,
      { revalidate: 60, timeoutMs: 8_000 }
    )
  } catch (error) {
    console.error("[Category API] Failed to fetch categories.", error)
    return {
      data: [],
      meta: {
        total: 0,
        page,
        limit,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }
  }
}

export async function getStoreCategoryBySlug(
  slug: string
): Promise<StoreCategory | null> {
  try {
    const response = await serverApi.get<StoreCategoriesResponse>(
      `/categories?isActive=true&search=${encodeURIComponent(slug)}&page=1&limit=100`,
      { revalidate: 60, timeoutMs: 8_000 }
    )

    return response.data.find((category) => category.slug === slug) ?? null
  } catch (error) {
    console.error("[Category API] Failed to fetch category.", error)
    return null
  }
}
