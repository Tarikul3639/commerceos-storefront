import Link from "next/link"
import { ArrowDownRight, ArrowLeft, ArrowRight, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BrandGrid } from "@/features/brands/components/brand-grid"
import { getStoreBrandsPage } from "@/features/brands/api/brand.api"
import { Banner } from "@/features/banner/components/banner"
import { getBannerSlides } from "@/features/banner/api/banner.api"

type BrandsPageProps = {
  searchParams: Promise<{ page?: string; search?: string }>
}

export async function BrandsPage({ searchParams }: BrandsPageProps) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const search = params.search?.trim().slice(0, 100) ?? ""
  const [brands, brandBanners] = await Promise.all([
    getStoreBrandsPage(page, 24, search || undefined),
    getBannerSlides("BRAND_TOP"),
  ])

  const pageHref = (nextPage: number) => {
    const query = new URLSearchParams()
    query.set("page", String(nextPage))
    if (search) query.set("search", search)
    return `/brands?${query.toString()}`
  }

  return (
    <>
      <Banner slides={brandBanners} />
      <main className="mx-auto max-w-7xl px-2 py-8 pb-12 sm:px-4 lg:px-6">
      <header className="relative mb-7 overflow-hidden bg-muted/50 px-4 py-6 sm:mb-9 sm:px-8 sm:py-9 lg:px-10">
        <div className="pointer-events-none absolute -top-16 -right-10 size-48 border border-foreground/5 sm:-top-20 sm:-right-12 sm:size-64 lg:size-80" />
        <div className="pointer-events-none absolute -top-8 -right-1 size-36 border border-foreground/5 sm:-top-10 sm:-right-2 sm:size-48 lg:size-64" />

        <div className="relative grid gap-5 sm:gap-7 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.55fr)] md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2 sm:mb-4">
              <span className="h-px w-6 bg-primary sm:w-7" />
              <span className="text-[9px] font-semibold tracking-[0.18em] text-muted-foreground uppercase sm:text-[10px] sm:tracking-[0.22em]">
                The brand directory
              </span>
            </div>

            <h1 className="max-w-2xl text-3xl leading-[1.02] font-semibold tracking-[-0.045em] sm:text-4xl lg:text-5xl">
              Names worth
              <span className="pl-2 text-center font-serif font-normal text-primary italic">
                knowing.
              </span>
            </h1>
          </div>

          <div className="relative flex max-w-sm md:justify-self-end">
            <p className="text-xs leading-5 text-muted-foreground sm:text-base sm:leading-6">
              Explore the brands behind the pieces you love. Find your
              favorites and discover something new.
            </p>
            <ArrowDownRight className="ml-auto size-3.5 shrink-0 self-end text-primary sm:size-4" />
          </div>
        </div>
      </header>

      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="h-6 rounded-none px-2.5 text-[10px] tracking-wider"
          >
            {String(page).padStart(2, "0")}
          </Badge>
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Browse brands
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {brands.meta.total} {brands.meta.total === 1 ? "brand" : "brands"}
              {search ? ` matching “${search}”` : ""}
            </p>
          </div>
        </div>

        <form action="/brands" method="get" className="flex w-full gap-2 sm:max-w-sm">
          <Input
            name="search"
            defaultValue={search}
            placeholder="Search brands..."
            aria-label="Search brands"
            className="h-9"
          />
          <Button type="submit" size="icon" aria-label="Search brands">
            <Search className="size-4" />
          </Button>
          {search ? (
            <Button asChild type="button" variant="outline" size="sm" className="h-9">
              <Link href="/brands">Clear</Link>
            </Button>
          ) : null}
        </form>
      </div>

      <BrandGrid brands={brands.data} />

      {brands.meta.totalPages > 1 ? (
        <nav
          aria-label="Brand pagination"
          className="mt-10 flex items-center justify-between border-t border-border pt-5"
        >
          {brands.meta.hasPreviousPage ? (
            <Link
              href={pageHref(page - 1)}
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
            {String(brands.meta.totalPages).padStart(2, "0")}
          </span>
          {brands.meta.hasNextPage ? (
            <Link
              href={pageHref(page + 1)}
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
      </main>
    </>
  )
}
