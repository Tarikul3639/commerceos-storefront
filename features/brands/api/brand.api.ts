import { serverApi } from "@/lib/api/server-api"

export type StoreBrand = {
  id: string
  name: string
  slug: string
}

type StoreBrandsResponse = {
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

/** Fetch active public brands for the product filter drawer. */
export async function getStoreBrands(): Promise<StoreBrand[]> {
  try {
    const response = await serverApi.get<StoreBrandsResponse>(
      "/brands?isActive=true&page=1&limit=100",
      { revalidate: 60, timeoutMs: 8_000 }
    )

    return response.data
  } catch (error) {
    console.error("[Brand API] Failed to fetch storefront brands.", error)
    return []
  }
}
