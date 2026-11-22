import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ImageIcon } from "lucide-react"

import { Card } from "@/components/ui/card"
import type { StoreCategory } from "@/features/home/types/category.types"

export function CategoryGrid({ categories }: { categories: StoreCategory[] }) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed py-20 text-center">
        <ImageIcon className="mb-3 size-8 text-muted-foreground/50" />
        <p className="text-sm font-medium text-foreground">Nothing in the collection yet</p>
        <p className="mt-1 text-xs text-muted-foreground">Check back soon for new categories.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      {categories.map((category, index) => {
        const featured = index === 0

        return (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className={`group block min-w-0 rounded-none outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${featured ? "md:col-span-2 md:row-span-2" : ""}`}
          >
            <Card className="relative aspect-4/5 h-full min-h-0 gap-0 overflow-hidden rounded-none border-0 bg-muted p-0 shadow-none ring-0">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  priority
                  sizes={featured
                    ? "(max-width: 768px) 50vw, (max-width: 1280px) 66vw, 50vw"
                    : "(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-muted-foreground">
                  <ImageIcon className="size-10 opacity-40" />
                </div>
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-black/10 transition-opacity duration-300 group-hover:from-black/80" />

              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3 sm:p-4">
                <span className="rounded-none border border-white/30 bg-black/15 px-2.5 py-1 text-[10px] font-medium tracking-wider text-white backdrop-blur-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex size-8 items-center justify-center rounded-none bg-white/15 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                  <ArrowUpRight className="size-4" />
                </span>
              </div>

              <div className={`absolute inset-x-0 bottom-0 p-3 text-left sm:p-5 ${featured ? "sm:p-7" : ""}`}>
                <h2 className={`line-clamp-2 font-semibold tracking-tight text-white ${featured ? "text-xl sm:text-3xl" : "text-sm sm:text-lg"}`}>
                  {category.name}
                </h2>
                {category.description ? (
                  <p className={`mt-1 line-clamp-2 text-white/75 ${featured ? "max-w-md text-xs sm:text-sm" : "hidden text-xs sm:block"}`}>
                    {category.description}
                  </p>
                ) : null}
                <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold tracking-[0.15em] text-white/90 uppercase sm:mt-4">
                  Discover collection
                  <span className="h-px w-5 bg-white/70 transition-all duration-300 group-hover:w-9" />
                </div>
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
