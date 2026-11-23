"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

import type { StoreCategory } from "../types/category.types"

interface CategoryShowcaseProps {
  categories: StoreCategory[]
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [canScroll, setCanScroll] = useState(false)

  const plugins = useMemo(
    () => [
      Autoplay({
        delay: 3000,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
        playOnInit: categories.length > 4,
      }),
    ],
    [categories.length]
  )

  // Check actual carousel scroll availability
  useEffect(() => {
    if (!api) return

    const updateScrollState = () => {
      setCanScroll(api.canScrollPrev() || api.canScrollNext())
    }

    updateScrollState()

    api.on("select", updateScrollState)
    api.on("reInit", updateScrollState)

    return () => {
      api.off("select", updateScrollState)
      api.off("reInit", updateScrollState)
    }
  }, [api])

  if (categories.length === 0) return null

  return (
    <section
      aria-labelledby="shop-by-category-heading"
      className="bg-background"
    >
      <div className="mx-auto max-w-7xl px-2 pt-8 pb-2 sm:px-4 sm:pt-10 sm:pb-4 lg:px-6">
        {/* Section Header */}
        <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
          <h2
            id="shop-by-category-heading"
            className="text-xl leading-tight font-semibold tracking-tight text-foreground sm:text-2xl"
          >
            Find your
            <span className="ml-2 font-serif font-normal text-primary italic">
              kind of style.
            </span>
          </h2>

          <Link
            href="/categories"
            className="group inline-flex w-fit shrink-0 items-center gap-2 border-b border-foreground/20 pb-1 text-xs font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Explore all
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Category Carousel */}
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: categories.length > 4,
            dragFree: true,
            containScroll: "trimSnaps",
          }}
          plugins={plugins}
          className="group/carousel w-full"
        >
          <CarouselContent className="-ml-3 sm:-ml-5">
            {categories.map((category) => (
              <CarouselItem
                key={category.id}
                className="shrink-0 basis-auto pl-5 sm:pl-7"
              >
                <li className="list-none">
                  <Link
                    href={`/categories/${category.slug}`}
                    title={`Browse ${category.name} products`}
                    className="group flex w-20 flex-col items-center gap-2.5 py-1.5 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:w-24 md:w-28"
                  >
                    <span className="relative block size-20 overflow-hidden rounded-full bg-muted ring-1 ring-border transition-all duration-300 group-hover:ring-2 group-hover:ring-primary group-focus-visible:ring-2 group-focus-visible:ring-primary sm:size-24 md:size-28">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt=""
                          fill
                          sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 112px"
                          className="object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                        />
                      ) : (
                        <span
                          aria-hidden="true"
                          className="flex size-full items-center justify-center text-xl font-semibold text-muted-foreground sm:text-2xl"
                        >
                          {category.name.slice(0, 1).toUpperCase()}
                        </span>
                      )}
                    </span>

                    <span className="w-full truncate text-center text-xs font-medium text-foreground transition-colors group-hover:text-primary sm:text-sm">
                      {category.name}
                    </span>
                  </Link>
                </li>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Buttons */}
          {canScroll && (
            <>
              <CarouselPrevious
                aria-label="Previous categories"
                className="left-0 hidden group-hover/carousel:flex"
              />

              <CarouselNext
                aria-label="Next categories"
                className="right-0 hidden group-hover/carousel:flex"
              />
            </>
          )}
        </Carousel>
      </div>
    </section>
  )
}
