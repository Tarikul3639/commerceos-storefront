"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Search, SlidersHorizontal } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { StoreBrand } from "@/features/brands/api/brand.api"
import type { StoreCategory } from "@/features/home/types/category.types"
import type { StoreProductFilters } from "@/features/product/api/product.api"
import { ProductGrid } from "@/features/product/components/product-card/product-grid"
import type { StoreProduct } from "@/features/product/types/product.types"
import { ProductFiltersSheet } from "./product-filters-sheet"

type ProductsListingProps = {
  products: StoreProduct[]
  total: number
  totalPages: number
  page: number
  categories: StoreCategory[]
  brands: StoreBrand[]
  filters: StoreProductFilters
  title?: string
  description?: string
}

/** Interactive catalog toolbar and result grid; all applied filters remain in the URL for sharing. */
export function ProductsListing({
  products,
  total,
  totalPages,
  page,
  categories,
  brands,
  filters,
  title = "All products",
  description = "Find the right fit from our complete product collection.",
}: ProductsListingProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const filterValues = useMemo(
    () => ({
      categoryId: filters.categoryId,
      brandId: filters.brandId,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      inStock: filters.inStock,
      isFeatured: filters.isFeatured,
    }),
    [
      filters.categoryId,
      filters.brandId,
      filters.minPrice,
      filters.maxPrice,
      filters.inStock,
      filters.isFeatured,
    ]
  )

  const activeFilterCount = [
    filters.categoryId,
    filters.brandId,
    filters.minPrice !== undefined || filters.maxPrice !== undefined,
    filters.inStock,
    filters.isFeatured,
  ].filter(Boolean).length

  function navigateWith(
    next: Record<string, string | number | boolean | undefined>
  ) {
    const params = new URLSearchParams(searchParams.toString())

    for (const [key, value] of Object.entries(next)) {
      if (value === undefined || value === "" || value === false) {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    }

    params.set("page", "1")
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }

  function applyFilters(values: {
    categoryId?: string
    brandId?: string
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
    isFeatured?: boolean
  }) {
    navigateWith({
      categoryId: values.categoryId,
      brandId: values.brandId,
      minPrice: values.minPrice,
      maxPrice: values.maxPrice,
      inStock: values.inStock,
      isFeatured: values.isFeatured,
    })
  }

  function applySort(value: string) {
    const [sortBy, sortOrder] = value.split(":")
    navigateWith({
      sortBy: sortBy === "default" ? undefined : sortBy,
      sortOrder: sortBy === "default" ? undefined : sortOrder,
    })
  }

  const sortValue =
    filters.sortBy && filters.sortOrder
      ? `${filters.sortBy}:${filters.sortOrder}`
      : "default"

  const pageHref = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(nextPage))
    return `${pathname}?${params.toString()}`
  }

  return (
    <section className="mx-auto max-w-7xl px-2 py-7 pb-12 sm:px-4 sm:py-9 lg:px-6">
      <header className="mb-6 flex flex-col gap-4 border-b border-border pb-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Explore the collection
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}<span className="text-primary">.</span>
          </h1>
          <p className="mt-2 max-w-xl text-xs leading-5 text-muted-foreground sm:text-sm">
            {description}
          </p>
        </div>

        <form
          className="flex w-full gap-2 sm:max-w-sm"
          onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const query = String(formData.get("search") ?? "").trim()
            navigateWith({ search: query || undefined })
          }}
        >
          <Input
            name="search"
            defaultValue={filters.search ?? ""}
            placeholder="Search products..."
            aria-label="Search products"
            className="h-9"
          />
          <Button type="submit" size="icon" aria-label="Search">
            <Search className="size-4" />
          </Button>
        </form>
      </header>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ProductFiltersSheet
            categories={categories}
            brands={brands}
            values={filterValues}
            activeCount={activeFilterCount}
            onApply={applyFilters}
          />
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{total}</span>{" "}
            {total === 1 ? "product" : "products"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-3.5 text-muted-foreground" />
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Sort by
          </span>
          <Select value={sortValue} onValueChange={applySort}>
            <SelectTrigger className="w-38.75">
              <SelectValue placeholder="Sort products" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="default">Newest first</SelectItem>
              <SelectItem value="createdAt:asc">Oldest first</SelectItem>
              <SelectItem value="sellingPrice:asc">
                Price: low to high
              </SelectItem>
              <SelectItem value="sellingPrice:desc">
                Price: high to low
              </SelectItem>
              <SelectItem value="name:asc">Name: A to Z</SelectItem>
              <SelectItem value="name:desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeFilterCount > 0 || filters.search ? (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {filters.search ? (
            <span className="bg-muted px-2.5 py-1 text-[11px]">
              Search: {filters.search}
            </span>
          ) : null}
          {filters.categoryId ? (
            <span className="bg-muted px-2.5 py-1 text-[11px]">
              {categories.find((item) => item.id === filters.categoryId)
                ?.name ?? "Category"}
            </span>
          ) : null}
          {filters.brandId ? (
            <span className="bg-muted px-2.5 py-1 text-[11px]">
              {brands.find((item) => item.id === filters.brandId)?.name ??
                "Brand"}
            </span>
          ) : null}
          {filters.minPrice !== undefined || filters.maxPrice !== undefined ? (
            <span className="bg-muted px-2.5 py-1 text-[11px]">
              ৳{filters.minPrice ?? 0} – ৳{filters.maxPrice ?? "Any"}
            </span>
          ) : null}
          <Button
            variant="link"
            size="xs"
            className="h-auto px-1 text-muted-foreground"
            onClick={() =>
              navigateWith({
                search: undefined,
                categoryId: undefined,
                brandId: undefined,
                minPrice: undefined,
                maxPrice: undefined,
                inStock: undefined,
                isFeatured: undefined,
              })
            }
          >
            Clear filters
          </Button>
        </div>
      ) : null}

      <ProductGrid
        products={products}
        emptyMessage="Try changing your search or removing some filters."
      />

      {totalPages > 1 ? (
        <nav
          aria-label="Product pagination"
          className="mt-9 flex items-center justify-between border-t border-border pt-5"
        >
          {page > 1 ? (
            <Link
              href={pageHref(page - 1)}
              className="border border-border px-3 py-2 text-xs hover:bg-muted"
            >
              Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground tabular-nums">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={pageHref(page + 1)}
              className="border border-border px-3 py-2 text-xs hover:bg-muted"
            >
              Next
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </section>
  )
}
