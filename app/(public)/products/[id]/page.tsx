import { RecentlyViewedTracker } from "@/features/product/components/recently-viewed/recently-viewed-tracker"
import { ProductDetailsPage } from "@/features/product/components/product-details/product-details-page"
import { Banner } from "@/features/banner/components/banner"
import { getBannerSlides } from "@/features/banner/api/banner.api"

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ sku?: string }>
}) {
  const [{ id }, query, banners] = await Promise.all([
    params,
    searchParams,
    getBannerSlides("PRODUCT_TOP"),
  ])

  return (
    <>
      <Banner slides={banners} />
      <RecentlyViewedTracker productId={id} />
      <ProductDetailsPage
        key={`${id}:${query.sku ?? ""}`}
        productId={id}
        initialSku={query.sku ?? null}
      />
    </>
  )
}
