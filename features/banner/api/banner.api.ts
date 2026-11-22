import { serverApi } from "@/lib/api/server-api"
import type { BannerPlacement, BannerSlideData } from "../types/banner.types"

/**
 * Fetches active banners for the requested storefront placement.
 * Returns an empty list if the optional banner feed is unavailable.
 */
export async function getBannerSlides(
  position: BannerPlacement
): Promise<BannerSlideData[]> {
  try {
    return await serverApi.get<BannerSlideData[]>(
      `/banners/storefront?position=${encodeURIComponent(position)}`,
      {
        revalidate: 60,
        timeoutMs: 8_000,
      }
    )
  } catch (error) {
    console.error(`[Banner API] Failed to fetch ${position} banners.`, error)
    return []
  }
}
