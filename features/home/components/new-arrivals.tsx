import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { ProductGrid } from "@/features/product/components/product-card/product-grid"
import type { StoreProduct } from "@/features/product/types/product.types"

/**
 * Renders the latest published non-featured products as a server-rendered
 * homepage section, keeping its initial product content available to crawlers.
 */
export function NewArrivals({ products }: { products: StoreProduct[] }) {
  if (products.length === 0) return null

  return (
    <section aria-labelledby="new-arrivals-heading" className="bg-background">
      <div className="mx-auto max-w-7xl px-2 pt-8 pb-10 sm:px-4 sm:pt-10 lg:px-6">
        <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
          <div>
            <p className="mb-1 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
              Just landed
            </p>
            <h2
              id="new-arrivals-heading"
              className="text-xl leading-tight font-semibold tracking-tight text-foreground sm:text-2xl"
            >
              New{" "}
              <span className="font-serif font-normal text-primary italic">
                arrivals.
              </span>
            </h2>
          </div>
          <Link
            href="/products"
            className="group inline-flex w-fit shrink-0 items-center gap-2 border-b border-foreground/20 pb-1 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            View all
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
        <ProductGrid products={products} />
      </div>
    </section>
  )
}
