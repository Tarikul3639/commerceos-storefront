"use client"

import { useEffect, useMemo, useState } from "react"
import Autoplay from "embla-carousel-autoplay"
import { useReducedMotion } from "motion/react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { cn } from "@/lib/utils"
import type { BannerSlideData } from "../types/banner.types"
import { BannerSlide } from "./banner-slide"

const AUTOPLAY_MS = 6000

/**
 * Displays backend-managed homepage campaigns in the shared shadcn carousel.
 * Autoplay uses the Embla autoplay plugin: it pauses on hover/focus, keeps
 * running after manual navigation, and is off for reduced-motion users.
 */
export function Banner({ slides }: { slides: BannerSlideData[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  const hasMultiple = slides.length > 1

  const plugins = useMemo(
    () => [
      Autoplay({
        delay: AUTOPLAY_MS,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
        playOnInit: hasMultiple && !prefersReducedMotion,
      }),
    ],
    [hasMultiple, prefersReducedMotion]
  )

  useEffect(() => {
    if (!api) return

    const updateActiveIndex = () => setActiveIndex(api.selectedScrollSnap())

    updateActiveIndex()
    api.on("select", updateActiveIndex)
    api.on("reInit", updateActiveIndex)

    return () => {
      api.off("select", updateActiveIndex)
      api.off("reInit", updateActiveIndex)
    }
  }, [api])

  if (slides.length === 0) return null

  return (
    <section
      aria-label="Featured campaigns"
      className="mx-auto w-full max-w-7xl px-2 pt-4 sm:px-4 lg:px-6"
    >
      <div className="group relative">
        <Carousel
          opts={{ align: "start", loop: hasMultiple }}
          plugins={plugins}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent className="ml-0">
            {slides.map((slide, index) => (
              <CarouselItem
                key={slide.id}
                className="pl-0"
                aria-label={`${index + 1} of ${slides.length}`}
              >
                <BannerSlide slide={slide} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {hasMultiple ? (
            <div className="hidden sm:block">
              <CarouselPrevious
                variant="secondary"
                aria-label="Previous campaign"
                className="pointer-events-none absolute left-3 size-10 opacity-0 transition-opacity duration-300 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100 [&_svg]:size-5!"
              />

              <CarouselNext
                variant="secondary"
                aria-label="Next campaign"
                className="pointer-events-none absolute right-4 size-10 opacity-0 transition-opacity duration-300 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100 [&_svg]:size-5!"
              />
            </div>
          ) : null}
        </Carousel>

        {hasMultiple ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-start sm:bottom-5 px-5 md:px-20">
            <div
              role="group"
              aria-label="Choose campaign"
              className="pointer-events-auto flex items-center gap-0.5 rounded-full bg-black/35 px-2.5 backdrop-blur-sm"
            >
              {slides.map((slide, index) => {
                const isActive = activeIndex === index

                return (
                  <button
                    key={slide.id}
                    type="button"
                    aria-label={`Go to campaign ${index + 1}`}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => api?.scrollTo(index)}
                    className="flex h-4 sm:h-6 items-center rounded-full px-1 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  >
                    <span
                      className={cn(
                        "block h-1 sm:h-1.5 rounded-full transition-[width,background-color] duration-300 motion-reduce:transition-none",
                        isActive ? "w-4 sm:w-6 bg-white" : "w-1 sm:w-1.5 bg-white/55"
                      )}
                    />
                  </button>
                )
              })}

              <span className="hidden rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium tracking-wider text-white tabular-nums sm:block">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}