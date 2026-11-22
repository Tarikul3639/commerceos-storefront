import { Banner } from "@/features/banner/components/banner"
import { getBannerSlides } from "@/features/banner/api/banner.api"
import { CategoryShowcase } from "./category-showcase"
import { getHomeCategories } from "../api/category.api"

/**
 * Composes the storefront homepage with the primary campaign banner followed
 * by active product categories for quick product discovery.
 */
export async function HomePage() {
  const [homeTopBanners, categories] = await Promise.all([
    getBannerSlides("HOME_TOP"),
    getHomeCategories(),
  ])

  return (
    <>
      <Banner slides={homeTopBanners} />
      <CategoryShowcase categories={categories} />
    </>
  )
}
