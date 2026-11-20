import Link from "next/link"

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <Link
            href="/"
            className="font-semibold tracking-tight text-foreground"
          >
            Your Store
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Discover something you will love.
          </p>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap gap-x-6 gap-y-3"
        >
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Your Store. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
