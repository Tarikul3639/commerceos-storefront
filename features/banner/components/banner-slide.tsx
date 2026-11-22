"use client"

import Image from "next/image"
import Link from "next/link"

import { useIsMobile } from "@/hooks/use-mobile"
import type { BannerSlideData } from "../types/banner.types"

type BannerSlideProps = {
  slide: BannerSlideData
  /** True for the first slide: preloads its image. */
  priority?: boolean
}

/**
 * Renders a responsive campaign image with an optional full-image link.
 *
 * Uses one next/image and picks the source with `useIsMobile` (< 768px):
 * the mobile image on phones, the desktop image everywhere else.
 */
export function BannerSlide({ slide, priority = false }: BannerSlideProps) {
  const isMobile = useIsMobile()

  const src =
    isMobile && slide.mobileImageUrl ? slide.mobileImageUrl : slide.imageUrl

  return (
    <div className="relative aspect-16/11 w-full overflow-hidden rounded bg-muted md:aspect-2/1 lg:aspect-32/9">
      {slide.link ? (
        <Link
          href={slide.link}
          aria-label="Open featured campaign"
          className="absolute inset-0 block focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          target={slide.openInNewTab ? "_blank" : undefined}
          rel={slide.openInNewTab ? "noopener noreferrer" : undefined}
        >
          <Image
            key={src}
            src={src}
            alt={slide.link}
            fill
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            sizes="(min-width: 1280px) 1216px, 100vw"
            draggable={false}
            className="object-cover object-center select-none"
          />
        </Link>
      ) : (
        <Image
          key={src}
          src={src}
          alt={slide.link ? slide.link : "Featured campaign"}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          sizes="(min-width: 1280px) 1216px, 100vw"
          draggable={false}
          className="object-cover object-center select-none"
        />
      )}
    </div>
  )
}
