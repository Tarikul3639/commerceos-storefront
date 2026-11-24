"use client"

import Link from "next/link"
import { ArrowUpRight, Clock3 } from "lucide-react"

import { ProductGrid } from "@/features/product/components/product-card/product-grid"
import { useRecentlyViewedProducts } from "@/features/product/hooks/use-recently-viewed-products"
import { useRecentlyViewedStore } from "@/features/product/store/recently-viewed-store"

export function RecentlyViewed() {
  const { data: products, isPending } = useRecentlyViewedProducts()
  const hydrated = useRecentlyViewedStore((state) => state.hydrated)

  if (!hydrated || isPending || !products?.length) return null

  return (
    <section
      aria-labelledby="recently-viewed-heading"
      className="border-t border-border/70 bg-muted/20"
    >
      <div className="mx-auto max-w-7xl px-2 py-9 sm:px-4 sm:py-12 lg:px-6">
        <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
          <div>
            <p className="mb-1 flex items-center gap-1.5 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
              <Clock3 className="size-3.5" />
              Pick up where you left off
            </p>
            <h2
              id="recently-viewed-heading"
              className="text-xl leading-tight font-semibold tracking-tight text-foreground sm:text-2xl"
            >
              Recently{" "}
              <span className="font-serif font-normal text-primary italic">
                viewed.
              </span>
            </h2>
          </div>
          <Link
            href="/products"
            className="group inline-flex w-fit shrink-0 items-center gap-2 border-b border-foreground/20 pb-1 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Explore more
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  )
}
