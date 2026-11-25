import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, HeartHandshake, Search, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ContentPage, ContentSection } from "@/components/layout/content-page"
import { storeConfig } from "@/config/store.config"

export const metadata: Metadata = {
  title: "Our Story | " + storeConfig.name,
  description: "Learn more about " + storeConfig.name + " and the shopping experience we aim to provide.",
}

const principles = [
  { icon: Search, title: "Easy discovery", description: "Browse products through categories and brands, and use search to find what you need." },
  { icon: ShoppingBag, title: "A simpler shopping flow", description: "Keep track of products you like and review your shopping bag before checkout." },
  { icon: HeartHandshake, title: "Helpful support", description: "Reach out to the store team for assistance with your shopping experience." },
]

export default function AboutPage() {
  return (
    <ContentPage eyebrow="Who we are" title={"A little about " + storeConfig.name} description={storeConfig.description}>
      <div className="mx-auto max-w-4xl">
        <section className="grid gap-8 border-y border-border py-8 sm:grid-cols-[1.1fr_0.9fr] sm:items-center sm:gap-12 sm:py-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Our story</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Shopping should feel clear and straightforward.</h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{storeConfig.name} is an online storefront built to make it easier to explore products, discover brands, and manage the items you are interested in. We want the experience to feel simple from the first browse to checkout.</p>
            <Button asChild className="mt-6 rounded-sm">
              <Link href="/products">Explore products <ArrowRight className="ml-2 size-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex min-h-36 flex-col justify-between rounded-sm border border-border bg-muted/30 p-4">
              <Search className="size-5 text-primary" />
              <p className="text-sm font-medium">Discover with ease</p>
            </div>
            <div className="mt-7 flex min-h-36 flex-col justify-between rounded-sm border border-border p-4">
              <ShoppingBag className="size-5 text-primary" />
              <p className="text-sm font-medium">Shop with confidence</p>
            </div>
          </div>
        </section>
        <section className="py-10 sm:py-12">
          <div className="mb-6 max-w-xl">
            <h2 className="text-xl font-semibold tracking-tight">What shapes the experience</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">The storefront is organized around a few practical ideas.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {principles.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-sm border border-border p-5">
                <Icon className="size-5 text-primary" />
                <h3 className="mt-4 text-sm font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </section>
        <ContentSection title="Get to know us">
          <p>Every store has its own products, people, and story. For questions about a product, an order, or the store itself, our contact page is the best place to start.</p>
          <p><Link href="/contact" className="font-medium text-foreground underline underline-offset-4">Contact the team</Link></p>
        </ContentSection>
      </div>
    </ContentPage>
  )
}
