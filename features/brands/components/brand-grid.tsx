import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ImageIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import type { StoreBrand } from "@/features/brands/api/brand.api"

export function BrandGrid({ brands }: { brands: StoreBrand[] }) {
  if (brands.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed py-20 text-center">
        <ImageIcon className="mb-3 size-8 text-muted-foreground/50" />
        <p className="text-sm font-medium text-foreground">
          No brands found
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Try another search or check back soon.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 xl:grid-cols-4">
      {brands.map((brand, index) => (
        <Link
          key={brand.id}
          href={`/products?brandId=${brand.id}`}
          aria-label={`Explore ${brand.name} products`}
          className="group block min-w-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Card className="relative flex aspect-4/3 h-full min-h-0 flex-col items-center justify-center gap-3 overflow-hidden rounded-none border border-border/70 bg-card p-4 shadow-none transition-colors group-hover:bg-muted/40 sm:gap-4 sm:p-6">
            <span className="absolute left-3 top-3 text-[9px] font-medium tracking-[0.16em] text-muted-foreground tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="absolute right-3 top-3 flex size-7 items-center justify-center border border-border text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100">
              <ArrowUpRight className="size-3.5" />
            </span>

            <div className="relative flex h-16 w-full items-center justify-center sm:h-20">
              {brand.image ? (
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1280px) 30vw, 22vw"
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <ImageIcon className="size-5 opacity-50" />
                </div>
              )}
            </div>

            <div className="w-full text-center">
              <h2 className="line-clamp-1 text-sm font-semibold tracking-tight sm:text-base">
                {brand.name}
              </h2>
              {brand.description ? (
                <p className="mx-auto mt-1 line-clamp-2 max-w-xs text-[10px] leading-4 text-muted-foreground sm:text-xs">
                  {brand.description}
                </p>
              ) : (
                <p className="mt-1 text-[10px] tracking-[0.14em] text-muted-foreground uppercase sm:text-[11px]">
                  Explore collection
                </p>
              )}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
