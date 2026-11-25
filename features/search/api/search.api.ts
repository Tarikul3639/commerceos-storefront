import { baseApi } from "@/lib/api/base-api"
import type { StoreProductSearchResponse } from "../types/search.types"

export async function searchStoreProducts(
  query: string,
  signal?: AbortSignal
): Promise<StoreProductSearchResponse> {
  const params = new URLSearchParams({ q: query })

  return baseApi.get<StoreProductSearchResponse>(
    `/search/products?${params.toString()}`,
    { signal }
  )
}
