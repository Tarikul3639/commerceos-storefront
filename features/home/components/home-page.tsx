import Link from "next/link"
import { ArrowUpRight, Boxes, Store, Tags } from "lucide-react"

import { Banner } from "@/features/banner/components/banner"
import { getBannerSlides } from "@/features/banner/api/banner.api"

const discoveryLinks = [
  {
    href: "/products",
    title: "All products",
    description: "Browse the complete product collection.",
    icon: Boxes,
  },
  {
    href: "/categories",
    title: "Categories",
    description: "Explore products by category.",
    icon: Tags,
  },
  {
    href: "/brands",
    title: "Brands",
    description: "Discover the brands available in this store.",
    icon: Store,
  },
]

/**
 * Composes the public homepage and requests only its HOME_TOP placement.
 * Other storefront sections can reuse the same API with their own position.
 */
export async function HomePage() {
  const homeTopBanners = await getBannerSlides("HOME_TOP")

  return (
    <>
      <Banner slides={homeTopBanners} />

      <section className="bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                Start exploring
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Find your way around
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Start with the full collection, explore categories, or discover
              available brands.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {discoveryLinks.map((item) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex min-h-48 flex-col justify-between rounded-2xl border border-border bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div className="mt-8 flex items-end justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <ArrowUpRight className="mb-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}