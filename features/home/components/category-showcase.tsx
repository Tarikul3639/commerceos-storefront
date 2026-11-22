import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Sparkles } from "lucide-react"

import { Card } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import type { StoreCategory } from "../types/category.types"

interface CategoryShowcaseProps {
  categories: StoreCategory[]
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (categories.length === 0) return null

  return (
    <section
      aria-labelledby="shop-by-category-heading"
      className="bg-background"
    >
      <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-11 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2
              id="shop-by-category-heading"
              className="text-2xl leading-tight font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              Find your
              <span className="ml-2 font-serif font-normal italic text-primary">
                kind of style.
              </span>
            </h2>
          </div>

          <Link
            href="/categories"
            className="group inline-flex w-fit shrink-0 items-center gap-2 border-b border-foreground/20 pb-1 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Explore all
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ScrollArea
          type="scroll"
          className="w-full"
        >
          <div
            aria-label="Browse categories"
            className="flex w-max gap-3 pb-3"
          >
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group block w-28 shrink-0 rounded-xl outline-none transition-transform hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-32"
              >
                <Card className="items-center gap-2 border-0 bg-transparent p-1 shadow-none ring-0">
                  <span className="relative block aspect-[4/5] w-full overflow-hidden rounded-xl bg-muted">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        priority
                        sizes="(max-width: 640px) 112px, 128px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-2xl font-semibold text-muted-foreground">
                        {category.name.slice(0, 1).toUpperCase()}
                      </span>
                    )}
                    <span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/35 to-transparent opacity-70" />
                  </span>
                  <span className="w-full truncate px-0.5 text-center text-xs font-semibold text-foreground transition-colors group-hover:text-primary sm:text-sm">
                    {category.name}
                  </span>
                </Card>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  )
}
