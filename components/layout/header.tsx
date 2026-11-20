import Image from "next/image"
import Link from "next/link"
import { Heart, Search, ShoppingBag, UserRound } from "lucide-react"

import { HeaderMenu } from "@/components/layout/header-menu"
import { storeConfig } from "@/config/store.config"

const categoryNavigation = [
  { href: "/products", label: "Shop all" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
  { href: "/about", label: "About" },
]

/**
 * Two-level storefront header with store branding and customer actions above product discovery navigation.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main header: brand, product search, and customer account actions. */}
        <div className="flex min-h-16 items-center gap-3 py-3">
          <div className="flex shrink-0 items-center gap-2">
            <div className="lg:hidden">
              <HeaderMenu />
            </div>

            <Link
              href="/"
              aria-label={storeConfig.name}
              className="text-lg font-semibold tracking-tight text-foreground"
            >
              {storeConfig.logo ? (
                <Image
                  src={storeConfig.logo}
                  alt={storeConfig.name}
                  width={160}
                  height={40}
                  priority
                  className="h-9 w-auto object-contain"
                />
              ) : (
                storeConfig.name
              )}
            </Link>
          </div>

          <form
            action="/search"
            role="search"
            className="hidden min-w-0 flex-1 md:block"
          >
            <label htmlFor="desktop-store-search" className="sr-only">
              Search products
            </label>
            <div className="relative mx-auto max-w-2xl">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="desktop-store-search"
                type="search"
                name="q"
                placeholder="Search products..."
                className="h-10 w-full rounded-md border border-input bg-muted/30 pr-4 pl-10 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
              />
            </div>
          </form>

          <nav
            aria-label="Customer actions"
            className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2"
          >
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Heart className="size-5" />
            </Link>
            <Link
              href="/account"
              aria-label="Login or account"
              className="inline-flex size-10 items-center justify-center gap-2 rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:w-auto sm:px-2"
            >
              <UserRound className="size-5" />
              <span className="hidden text-sm font-medium lg:inline">
                Login
              </span>
            </Link>
            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ShoppingBag className="size-5" />
            </Link>
          </nav>
        </div>

        {/* Mobile search moves below the brand row to preserve space for the action icons. */}
        <form action="/search" role="search" className="pb-3 md:hidden">
          <label htmlFor="mobile-store-search" className="sr-only">
            Search products
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="mobile-store-search"
              type="search"
              name="q"
              placeholder="Search products..."
              className="h-10 w-full rounded-md border border-input bg-muted/30 pr-4 pl-10 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20"
            />
          </div>
        </form>
      </div>

      {/* Secondary header: product discovery and category-level navigation. */}
      <div className="border-t border-border/70">
        <nav
          aria-label="Product categories"
          className="mx-auto flex max-w-7xl items-center gap-7 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8"
        >
          {categoryNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
