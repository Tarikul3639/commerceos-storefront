"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

export function HomeHero() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="mx-auto grid min-h-[620px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 md:grid-cols-[1.05fr_0.95fr] md:py-28 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles className="size-3.5 text-primary" />A fresh way to
            discover your next favorite
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.08]">
            Good finds.
            <span className="block text-primary">Better everyday.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Explore a thoughtful collection of products and find something that
            fits your everyday life.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Explore products
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/categories"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Browse categories
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={
            shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 18 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease: "easeOut" }}
          className="relative mx-auto w-full max-w-[520px]"
          aria-hidden="true"
        >
          <div className="relative aspect-[4/4.2] overflow-hidden rounded-[2rem] border border-border/70 bg-muted/60 p-5 shadow-2xl shadow-primary/5 sm:p-7">
            <div className="absolute -top-16 -right-16 size-64 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -bottom-20 -left-12 size-64 rounded-full bg-accent blur-3xl" />
            <div className="relative flex h-full flex-col justify-between rounded-[1.5rem] border border-white/60 bg-background/75 p-6 backdrop-blur-sm sm:p-8">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  Curated discovery
                </span>
                <span className="size-2.5 rounded-full bg-primary" />
              </div>

              <div className="relative flex flex-1 items-center justify-center py-8">
                <div className="absolute size-56 rounded-full border border-border/80 sm:size-64" />
                <div className="absolute size-44 rounded-full border border-dashed border-primary/30 sm:size-52" />
                <div className="relative flex size-40 rotate-[-8deg] items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary/90 to-primary shadow-xl shadow-primary/20 sm:size-48">
                  <div className="flex size-24 rotate-[8deg] items-center justify-center rounded-3xl border border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground sm:size-28">
                    <Sparkles className="size-12" strokeWidth={1.2} />
                  </div>
                </div>
                <div className="absolute top-[16%] right-[8%] size-12 rounded-2xl border border-border bg-background shadow-lg sm:size-14" />
                <div className="absolute bottom-[12%] left-[8%] size-16 rounded-full border border-border bg-background shadow-lg sm:size-20" />
              </div>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Made for discovery
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Find your next favorite
                  </p>
                </div>
                <span className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  Explore
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
