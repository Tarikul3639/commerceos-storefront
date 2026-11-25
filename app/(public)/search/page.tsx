import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { getStoreBrands } from "@/features/brands/api/brand.api"
import { getStoreCategories } from "@/features/categories/api/category.api"
import {
  getStoreProducts,
  type StoreProductFilters,
} from "@/features/product/api/product.api"
import { ProductsListing } from "@/features/product/components/product-listing/products-listing"

export const metadata: Metadata = {
  title: "Search Products",
  description: "Search the product collection and discover your next favorite.",
}

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getString(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined
}

/** Render shareable search results using the same catalog listing and filters. */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const legacyQuery = getString(params.q)
  const search = getString(params.search) ?? legacyQuery

  if (legacyQuery && !getString(params.search)) {
    redirect(`/search?search=${encodeURIComponent(legacyQuery)}`)
  }

  const filters: StoreProductFilters = {
    page: Math.max(1, Number(getString(params.page)) || 1),
    limit: 24,
    search,
  }

  const [products, categories, brands] = await Promise.all([
    getStoreProducts(filters),
    getStoreCategories(1, 100),
    getStoreBrands(),
  ])

  return (
    <ProductsListing
      products={products.data}
      total={products.total}
      totalPages={products.totalPages}
      page={products.page}
      categories={categories.data}
      brands={brands}
      filters={filters}
      title="Search results"
      description={
        search
          ? `Showing products matching “${search}”.`
          : "Explore products from the complete collection."
      }
    />
  )
}
