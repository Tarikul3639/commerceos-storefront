import Link from "next/link"

import type { BannerSlideData } from "../types/banner.types"

/**
 * Renders a responsive campaign image with an optional full-image link.
 * The mobile source is selected on small screens and the desktop image is the fallback.
 */
export function BannerSlide({ slide }: { slide: BannerSlideData }) {
  const image = (
    <picture className="absolute inset-0">
      {slide.mobileImageUrl ? (
        <source media="(max-width: 639px)" srcSet={slide.mobileImageUrl} />
      ) : null}
      <img
        src={slide.imageUrl}
        alt="Featured campaign"
        className="size-full object-cover object-center"
      />
    </picture>
  )

  return (
    <div className="relative aspect-16/11 w-full overflow-hidden rounded bg-muted sm:aspect-2/1 lg:aspect-32/9">
      {slide.link ? (
        <Link
          href={slide.link}
          aria-label="Open featured campaign"
          className="absolute inset-0 block focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
          target={slide.openInNewTab ? "_blank" : undefined}
          rel={slide.openInNewTab ? "noopener noreferrer" : undefined}
        >
          {image}
        </Link>
      ) : (
        image
      )}
    </div>
  )
}
