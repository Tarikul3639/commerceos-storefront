import { serverApi } from "@/lib/api/server-api"

export type StoreBrand = {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
}

export type StoreBrandsResponse = {
  data: StoreBrand[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

/** Fetch active public brands for the storefront. */
export async function getStoreBrandsPage(
  page = 1,
  limit = 24,
  search?: string
): Promise<StoreBrandsResponse> {
  const params = new URLSearchParams({
    isActive: "true",
    page: String(page),
    limit: String(limit),
  })

  if (search) params.set("search", search)

  try {
    return await serverApi.get<StoreBrandsResponse>(
      `/brands?${params.toString()}`,
      { revalidate: 60, timeoutMs: 8_000 }
    )
  } catch (error) {
    console.error("[Brand API] Failed to fetch storefront brands.", error)
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

/** Fetch active brands used by product filter controls. */
export async function getStoreBrands(): Promise<StoreBrand[]> {
  const response = await getStoreBrandsPage(1, 100)
  return response.data
}
