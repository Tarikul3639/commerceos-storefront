import { Banner } from "@/features/banner/components/banner"
import { getBannerSlides } from "@/features/banner/api/banner.api"
import { CategoryShowcase } from "./category-showcase"
import { getHomeCategories } from "../api/category.api"
import { getHomeFeaturedProducts } from "../api/product.api"
import { FeaturedProducts } from "./featured-products"

/**
 * Composes the storefront homepage with the primary campaign banner followed
 * by active product categories for quick product discovery.
 */
export async function HomePage() {
  const [homeTopBanners, categories, featuredProducts] = await Promise.all([
    getBannerSlides("HOME_TOP"),
    getHomeCategories(),
    getHomeFeaturedProducts(),
  ])

  return (
    <>
      <Banner slides={homeTopBanners} />
      <CategoryShowcase categories={categories} />
      <FeaturedProducts products={featuredProducts.data} />
    </>
  )
}
