import Link from "next/link"
import { Search, ShoppingBag, UserRound } from "lucide-react"

const navigation = [
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
  { href: "/about", label: "About" },
]

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground"
        >
          Your Store
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 md:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/search"
            aria-label="Search"
            className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Search className="size-[18px]" />
          </Link>
          <Link
            href="/account"
            aria-label="Account"
            className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <UserRound className="size-[18px]" />
          </Link>
          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ShoppingBag className="size-[18px]" />
          </Link>
        </div>
      </div>

      <nav
        aria-label="Mobile navigation"
        className="border-t border-border/60 px-4 py-2 md:hidden"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 overflow-x-auto">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-1 text-xs font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
