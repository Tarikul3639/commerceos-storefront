import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HomeClosingSection() {
  return (
    <section className="px-2 sm:px-4 lg:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden bg-foreground px-6 py-10 text-background sm:px-10 sm:py-14 lg:px-14">
        <svg
          aria-hidden="true"
          viewBox="0 0 520 360"
          fill="none"
          className="pointer-events-none absolute -top-12 -right-16 h-96 w-136 max-w-none text-primary/35 sm:-top-20 sm:right-0"
        >
          <path
            d="M258 65 210 91c-12 7-27 8-41 4l-32-10-37 50 53 38-24 133h205l-24-133 53-38-37-50-32 10c-14 4-29 3-41-4l-48-26Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M210 91c8 23 25 35 48 35s40-12 48-35M134 135l42 31m210-31-42 31M205 306l7-99m103 99-7-99"
            stroke="currentColor"
            strokeOpacity=".65"
            strokeWidth="1.2"
          />
          <path
            d="M258 126v180m-53-91h106"
            stroke="currentColor"
            strokeOpacity=".35"
            strokeDasharray="4 7"
          />
          <circle cx="258" cy="65" r="4" fill="currentColor" />
          <path
            d="M70 278c48-30 86-31 123-7m134-2c39-23 78-22 123 8"
            stroke="currentColor"
            strokeOpacity=".3"
            strokeWidth="1.2"
          />
          <path d="M52 304h416" stroke="currentColor" strokeOpacity=".2" />
        </svg>

        <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-foreground via-foreground/95 to-foreground/35" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-background/65 uppercase">
              A little more to discover
            </p>
            <h2 className="text-2xl leading-tight font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Your next favourite
              <span className="block font-serif font-normal text-background/70 italic">
                is waiting.
              </span>
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-background/65">
              Take another look around and find something that feels just right.
            </p>
          </div>
          <Link
            href="/products"
            className="group relative isolate inline-flex w-fit shrink-0 items-center gap-3 overflow-hidden border border-background/40 px-5 py-3 text-sm font-medium text-background transition-colors duration-300 before:absolute before:inset-0 before:-z-10 before:-translate-x-full before:bg-background before:transition-transform before:duration-500 before:ease-out hover:text-foreground hover:before:translate-x-0 focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground focus-visible:outline-none motion-reduce:before:transition-none"
          >
            Explore the collection
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
