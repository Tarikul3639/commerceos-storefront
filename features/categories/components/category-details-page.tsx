import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Banner } from "@/features/banner/components/banner"
import { getBannerSlides } from "@/features/banner/api/banner.api"
import { ProductGrid } from "@/features/product/components/product-card/product-grid"
import { getStoreCategoryBySlug } from "@/features/categories/api/category.api"
import { getCategoryProducts } from "@/features/product/api/product.api"

type CategoryDetailsPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function CategoryDetailsPage({
  params,
  searchParams,
}: CategoryDetailsPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams])
  const page = Math.max(1, Number(query.page) || 1)
  const category = await getStoreCategoryBySlug(slug)

  if (!category) notFound()

  const [banners, products] = await Promise.all([
    getBannerSlides("CATEGORY_TOP"),
    getCategoryProducts(category.id, page),
  ])

  return (
    <section>
      <Banner slides={banners} />

      <div className="mx-auto max-w-7xl px-2 py-8 pb-12 sm:px-4 lg:px-6">
        <nav
          aria-label="Breadcrumb"
          className="mb-5 text-sm text-muted-foreground"
        >
          <Link href="/categories" className="hover:text-foreground">
            Categories
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>

        <div className="mb-8 flex items-center gap-4">
          {category.image ? (
            <div className="relative size-16 shrink-0 overflow-hidden rounded bg-muted sm:size-20">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
          ) : null}
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {category.name}
            </h1>
            {category.description ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {category.description}
              </p>
            ) : null}
            <p className="mt-1 text-xs text-muted-foreground">
              {products.total} {products.total === 1 ? "product" : "products"}
            </p>
          </div>
        </div>

        <ProductGrid
          products={products.data}
          emptyMessage="Products in this category will appear here."
        />

        {products.totalPages > 1 ? (
          <nav
            aria-label="Product pagination"
            className="mt-8 flex items-center justify-center gap-4"
          >
            {page > 1 ? (
              <Link
                href={`/categories/${slug}?page=${page - 1}`}
                className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
              >
                Previous
              </Link>
            ) : null}
            <span className="text-sm text-muted-foreground">
              Page {page} of {products.totalPages}
            </span>
            {page < products.totalPages ? (
              <Link
                href={`/categories/${slug}?page=${page + 1}`}
                className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
              >
                Next
              </Link>
            ) : null}
          </nav>
        ) : null}
      </div>
    </section>
  )
}
