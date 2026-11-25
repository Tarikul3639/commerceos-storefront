import type { Metadata } from "next"

import { getStoreBrands } from "@/features/brands/api/brand.api"
import { getStoreCategories } from "@/features/categories/api/category.api"
import { ProductsListing } from "@/features/product/components/product-listing/products-listing"
import {
  getStoreProducts,
  type StoreProductFilters,
} from "@/features/product/api/product.api"

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Explore the complete product collection and find your next favorite.",
}

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function getString(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined
}

function getNumber(value: string | undefined): number | undefined {
  if (value === undefined) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}

function getBoolean(value: string | undefined): boolean | undefined {
  return value === "true" ? true : undefined
}

/** Server-render the catalog and its filter options from the public Store APIs. */
export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams
  const sortBy = getString(params.sortBy)
  const sortOrder = getString(params.sortOrder)

  const filters: StoreProductFilters = {
    page: Math.max(1, Number(getString(params.page)) || 1),
    limit: 24,
    search: getString(params.search),
    categoryId: getString(params.categoryId),
    brandId: getString(params.brandId),
    minPrice: getNumber(getString(params.minPrice)),
    maxPrice: getNumber(getString(params.maxPrice)),
    inStock: getBoolean(getString(params.inStock)),
    isFeatured: getBoolean(getString(params.isFeatured)),
    sortBy:
      sortBy === "name" || sortBy === "sellingPrice" || sortBy === "createdAt"
        ? sortBy
        : undefined,
    sortOrder:
      sortOrder === "asc" || sortOrder === "desc" ? sortOrder : undefined,
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
    />
  )
}
