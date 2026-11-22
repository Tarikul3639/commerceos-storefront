import { serverApi } from "@/lib/api/server-api"
import type { StoreCategoriesResponse } from "../types/category.types"

/** Fetch active categories for the homepage; the home route remains resilient to feed failures. */
export async function getHomeCategories() {
  try {
    const response = await serverApi.get<StoreCategoriesResponse>(
      "/categories?isActive=true&limit=8",
      { revalidate: 60, timeoutMs: 8_000 }
    )
    return response.data
  } catch (error) {
    console.error("[Category API] Failed to fetch homepage categories.", error)
    return []
  }
}
