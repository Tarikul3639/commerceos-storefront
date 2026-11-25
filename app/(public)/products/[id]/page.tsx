import { RecentlyViewedTracker } from "@/features/product/components/recently-viewed/recently-viewed-tracker"
import { ProductDetailsPage } from "@/features/product/components/product-details/product-details-page"

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ variant?: string }>
}) {
  const [{ id }, query] = await Promise.all([params, searchParams])

  return (
    <>
      <RecentlyViewedTracker productId={id} />
      <ProductDetailsPage
        key={`${id}:${query.variant ?? ""}`}
        productId={id}
        initialVariantId={query.variant ?? null}
      />
    </>
  )
}
