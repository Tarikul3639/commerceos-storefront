import type { Metadata } from "next"
import Link from "next/link"
import { ArrowDownRight, ArrowLeft, ArrowRight, Layers3 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Banner } from "@/features/banner/components/banner"
import { getBannerSlides } from "@/features/banner/api/banner.api"
import { CategoryGrid } from "@/features/categories/components/category-grid"
import { getStoreCategories } from "@/features/categories/api/category.api"

export const metadata: Metadata = {
  title: "Explore Categories",
  description: "A curated index of collections. Find the pieces that fit your world.",
}

type CategoriesPageProps = {
  searchParams: Promise<{ page?: string }>
}

export default async function CategoriesPage({
  searchParams,
}: CategoriesPageProps) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)

  const [banners, categories] = await Promise.all([
    getBannerSlides("CATEGORY_TOP"),
    getStoreCategories(page),
  ])

  return (
    <>
      <Banner slides={banners} />

      <div className="mx-auto max-w-7xl px-4 py-10 pb-14 sm:px-6 sm:py-14 lg:px-8">
        <header className="relative mb-9 overflow-hidden bg-muted/50 px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
          <div className="pointer-events-none absolute -top-20 -right-12 size-64 border border-foreground/5 sm:size-80" />
          <div className="pointer-events-none absolute -top-10 -right-2 size-48 border border-foreground/5 sm:size-64" />

          <div className="relative grid gap-7 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.55fr)] md:items-end">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-px w-7 bg-primary" />
                <span className="text-[10px] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
                  The collection index
                </span>
              </div>
              <h1 className="max-w-2xl text-4xl leading-[0.98] font-semibold tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                A world of
                <br />
                <span className="font-serif font-normal text-primary italic">
                  possibilities.
                </span>
              </h1>
            </div>

            <div className="relative max-w-sm md:justify-self-end">
              <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                Every collection has its own character. Take a look around and
                discover something that feels like you.
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs font-medium text-foreground">
                <Layers3 className="size-4 text-primary" />
                <span>{categories.meta.total} collections to explore</span>
                <ArrowDownRight className="ml-auto size-4 text-primary" />
              </div>
            </div>
          </div>
        </header>

        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="h-6 rounded-none px-2.5 text-[10px] tracking-wider"
            >
              {String(page).padStart(2, "0")}
            </Badge>
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Browse collections
            </p>
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {categories.meta.total}{" "}
            {categories.meta.total === 1 ? "category" : "categories"}
          </span>
        </div>

        <CategoryGrid categories={categories.data} />

        {categories.meta.totalPages > 1 ? (
          <nav
            aria-label="Category pagination"
            className="mt-10 flex items-center justify-between border-t border-border pt-5"
          >
            {categories.meta.hasPreviousPage ? (
              <Link
                href={`/categories?page=${page - 1}`}
                className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                Previous
              </Link>
            ) : (
              <span />
            )}
            <span className="text-xs text-muted-foreground tabular-nums">
              {String(page).padStart(2, "0")} /{" "}
              {String(categories.meta.totalPages).padStart(2, "0")}
            </span>
            {categories.meta.hasNextPage ? (
              <Link
                href={`/categories?page=${page + 1}`}
                className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Next
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </div>
    </>
  )
}
