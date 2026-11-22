import { Banner } from "@/features/banner/components/banner"
import { getBannerSlides } from "@/features/banner/api/banner.api"
import { CategoryShowcase } from "./category-showcase"
import { getHomeCategories } from "../api/category.api"
import { getHomeFeaturedProducts } from "../api/product.api"
import { getHomeNewArrivals } from "../api/home.api"
import { FeaturedProducts } from "./featured-products"
import { NewArrivals } from "./new-arrivals"

/**
 * Composes the storefront homepage sections in their intended merchandising order.
 * Both campaign placements reuse the shared, backend-managed banner feature.
 */
export async function HomePage() {
  const [
    homeTopBanners,
    categories,
    featuredProducts,
    promotionalBanners,
    newArrivals,
  ] = await Promise.all([
    getBannerSlides("HOME_TOP"),
    getHomeCategories(),
    getHomeFeaturedProducts(),
    getBannerSlides("HOME_MIDDLE"),
    getHomeNewArrivals(),
  ])

  return (
    <>
      <Banner slides={homeTopBanners} />
      <CategoryShowcase categories={categories} />
      <FeaturedProducts products={featuredProducts.data} />
      <Banner slides={promotionalBanners} />
      <NewArrivals products={newArrivals.data} />
    </>
  )
}
