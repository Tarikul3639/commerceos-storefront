import Link from "next/link"
import { ArrowDownRight, ArrowLeft, ArrowRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Banner } from "@/features/banner/components/banner"
import { getBannerSlides } from "@/features/banner/api/banner.api"
import { CategoryCta } from "@/features/categories/components/category-cta"
import { CategoryGrid } from "@/features/categories/components/category-grid"
import { getStoreCategories } from "@/features/categories/api/category.api"

type CategoriesPageProps = {
  searchParams: Promise<{ page?: string }>
}

export async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)

  const [banners, categories] = await Promise.all([
    getBannerSlides("CATEGORY_TOP"),
    getStoreCategories(page),
  ])

  return (
    <section>
      <Banner slides={banners} />

      <div className="mx-auto max-w-7xl px-2 py-8 pb-12 sm:px-4 lg:px-6">
        <header className="relative mb-6 overflow-hidden bg-muted/50 px-4 py-6 sm:mb-9 sm:px-8 sm:py-9 lg:px-10">
          <div className="pointer-events-none absolute -top-16 -right-10 size-48 border border-foreground/5 sm:-top-20 sm:-right-12 sm:size-64 lg:size-80" />
          <div className="pointer-events-none absolute -top-8 -right-1 size-36 border border-foreground/5 sm:-top-10 sm:-right-2 sm:size-48 lg:size-64" />

          <div className="relative grid gap-5 sm:gap-7 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.55fr)] md:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2 sm:mb-4">
                <span className="h-px w-6 bg-primary sm:w-7" />
                <span className="text-[9px] font-semibold tracking-[0.18em] text-muted-foreground uppercase sm:text-[10px] sm:tracking-[0.22em]">
                  The collection index
                </span>
              </div>

              <h1 className="max-w-2xl text-3xl leading-[1.02] font-semibold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
                A world of
                <span className="pl-2 text-center font-serif font-normal text-primary italic">
                  possibilities.
                </span>
              </h1>
            </div>

            <div className="flex relative max-w-sm md:justify-self-end">
              <p className="text-xs leading-5 text-muted-foreground sm:text-base sm:leading-6">
                Every collection has its own character. Take a look around and
                discover something that feels like you.
              </p>

              <ArrowDownRight className="ml-auto self-end size-3.5 shrink-0 text-primary sm:size-4" />
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

        <CategoryCta />
      </div>
    </section>
  )
}
