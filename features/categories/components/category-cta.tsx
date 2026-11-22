import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CategoryCta() {
  return (
    <section className="relative mt-12 overflow-hidden border border-border bg-muted/50 px-5 py-8 sm:mt-16 sm:px-8 sm:py-10 lg:px-12">
      <div className="pointer-events-none absolute -right-10 -bottom-24 size-56 border border-foreground/5 sm:-right-6 sm:-bottom-32 sm:size-80" />
      <div className="pointer-events-none absolute -right-2 -bottom-16 size-40 border border-foreground/5 sm:-right-1 sm:-bottom-24 sm:size-64" />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Your next discovery starts here
          </p>
          <h2 className="text-2xl leading-tight font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Found your kind of style?
            <br />
            <span className="font-serif font-normal text-primary italic">
              There’s more to explore.
            </span>
          </h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Browse the full collection and find the pieces that make your
            everyday feel a little more personal.
          </p>
        </div>

        <Link
          href="/products"
          className="group inline-flex w-fit shrink-0 items-center gap-3 bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Explore all products
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
