import type { ReactNode } from "react"

export function ContentPage({ eyebrow, title, description, children }: {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
      </header>
      {children}
    </main>
  )
}

export function ContentSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-border py-6 first:pt-0 last:border-b-0 last:pb-0 sm:py-8">
      <h2 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground sm:text-[15px]">{children}</div>
    </section>
  )
}
