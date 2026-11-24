import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export function HomeClosingSection() {
  return (
    <section className="px-2 pb-10 sm:px-4 sm:pb-14 lg:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden bg-foreground px-6 py-10 text-background sm:px-10 sm:py-14 lg:px-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 size-64 rounded-full border border-background/10 sm:right-16 sm:size-80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-12 right-12 size-44 rounded-full border border-background/10 sm:right-28 sm:size-60"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-background/65 uppercase">
              <Sparkles className="size-3.5" />
              A little more to discover
            </p>
            <h2 className="text-2xl leading-tight font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Your next favourite
              <span className="block font-serif font-normal text-background/70 italic">
                is waiting.
              </span>
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-background/65">
              Take another look around and find something that feels just
              right.
            </p>
          </div>
          <Link
            href="/products"
            className="group inline-flex w-fit shrink-0 items-center gap-3 border border-background/30 px-5 py-3 text-sm font-medium text-background transition-colors hover:border-background hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:outline-none"
          >
            Explore the collection
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
