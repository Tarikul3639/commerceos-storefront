import { Banner } from "@/features/banner/components/banner"
import { getBannerSlides } from "@/features/banner/api/banner.api"
import { CategoryShowcase } from "./category-showcase"
import { getHomeCategories } from "../api/category.api"
import { getHomeFeaturedProducts } from "../api/product.api"
import { getHomeNewArrivals, getHomeBestSellers } from "../api/home.api"
import { FeaturedProducts } from "./featured-products"
import { NewArrivals } from "./new-arrivals"
import { BestSellers } from "./best-sellers"
import { RecentlyViewed } from "./recently-viewed"
import { HomeClosingSection } from "./home-closing-section"

/**
 * Composes the storefront homepage sections in their intended merchandising order.
 * Homepage data is fetched concurrently and rendered server-side for SEO.
 */
export async function HomePage() {
  const [
    homeTopBanners,
    categories,
    featuredProducts,
    bestSellers,
    promotionalBanners,
    newArrivals,
  ] = await Promise.all([
    getBannerSlides("HOME_TOP"),
    getHomeCategories(),
    getHomeFeaturedProducts(),
    getHomeBestSellers(),
    getBannerSlides("HOME_MIDDLE"),
    getHomeNewArrivals(),
  ])

  return (
    <>
      <Banner slides={homeTopBanners} />
      <CategoryShowcase categories={categories} />
      <BestSellers products={bestSellers.data} />
      <FeaturedProducts products={featuredProducts.data} />
      <Banner slides={promotionalBanners} />
      <NewArrivals products={newArrivals.data} />
      <RecentlyViewed />
      <HomeClosingSection />
    </>
  )
}
