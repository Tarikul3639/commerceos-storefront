"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CornerDownLeft,
  Search,
  Tag,
  Info,
  Package,
  Store,
  UserRound,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

const navigationItems = [
  { href: "/products", label: "Shop all", icon: Store },
  { href: "/brands", label: "Brands", icon: Tag },
  { href: "/about", label: "Our story", icon: Info },
]
const featuredCategories = [
  {
    href: "/categories/new-arrivals",
    label: "New arrivals",
    description: "Just landed this week",
    badge: "New",
  },
  {
    href: "/categories/best-sellers",
    label: "Best sellers",
    description: "What everyone is buying",
  },
  {
    href: "/categories/home",
    label: "Home",
    description: "Decor, kitchen and storage",
  },
  {
    href: "/categories/beauty",
    label: "Beauty",
    description: "Skin, hair and body",
  },
  {
    href: "/categories/fashion",
    label: "Fashion",
    description: "Clothing and accessories",
  },
  {
    href: "/categories/electronics",
    label: "Electronics",
    description: "Gadgets and accessories",
  },
  {
    href: "/categories/sale",
    label: "Sale",
    description: "Limited-time discounts",
    badge: "Sale",
  },
  {
    href: "/categories/gifts",
    label: "Gifts",
    description: "Ideas for every budget",
  },
]
const accountLinks = [
  { href: "/account", label: "My account", icon: UserRound },
  { href: "/account/orders", label: "Orders", icon: Package },
]
const popularSearches = [
  "Gift sets",
  "Wireless earbuds",
  "Summer dresses",
  "Home decor",
]

/**
 * Reusable search trigger for desktop, mobile and drawer placements.
 * The optional callback lets a containing drawer close before search opens.
 */
export function SearchTrigger({
  variant,
  onOpen,
  onBeforeOpen,
}: {
  variant: "desktop" | "mobile" | "drawer"
  onOpen: () => void
  onBeforeOpen?: () => void
}) {
  const handleClick = () => {
    if (onBeforeOpen) {
      onBeforeOpen()
      window.setTimeout(onOpen, 200)
      return
    }
    onOpen()
  }

  if (variant === "desktop") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label="Search products"
        aria-haspopup="dialog"
        className="flex h-11 w-full items-center gap-3 rounded-full border border-transparent bg-muted px-4 text-sm text-muted-foreground transition-colors outline-none hover:bg-muted/70 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <Search aria-hidden="true" className="size-4 shrink-0" />
        <span className="flex-1 truncate text-left">Search products</span>
        <kbd
          aria-hidden="true"
          className="inline-flex h-5 items-center rounded border border-border bg-background px-1.5 text-[11px] font-medium"
        >
          ⌘K / Ctrl K
        </kbd>
      </button>
    )
  }

  if (variant === "drawer") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label="Search products"
        aria-haspopup="dialog"
        className="flex h-11 w-full items-center gap-3 rounded-full border border-transparent bg-muted px-4 text-sm text-muted-foreground transition-colors outline-none hover:bg-muted/70 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <Search aria-hidden="true" className="size-4 shrink-0" />
        <span className="flex-1 truncate text-left">Search products</span>
        <kbd
          aria-hidden="true"
          className="hidden h-5 items-center rounded border border-border bg-background px-1.5 text-[11px] font-medium sm:inline-flex"
        >
          ⌘K / Ctrl K
        </kbd>
      </button>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="text-foreground/80 hover:bg-muted hover:text-foreground md:hidden"
      aria-label="Search"
      aria-haspopup="dialog"
      onClick={handleClick}
    >
      <Search className="size-5" />
    </Button>
  )
}

/**
 * Search command palette with its own query state and store-owned quick links.
 * The header controls its visibility through explicit open-state props.
 */
export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const trimmed = query.trim()

  const go = useCallback(
    (href: string) => {
      onOpenChange(false)
      router.push(href)
    },
    [onOpenChange, router]
  )
  const searchFor = (term: string) =>
    go(`/search?q=${encodeURIComponent(term)}`)

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search the store"
      description="Search products, categories and pages"
    >
      <Command>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search products, categories, pages..."
        />
        <CommandList className="max-h-[min(24rem,60vh)]">
          {trimmed && (
            <CommandGroup forceMount>
              <CommandItem
                forceMount
                value={`search-for-${trimmed}`}
                onSelect={() => searchFor(trimmed)}
              >
                <Search />
                <span className="truncate">
                  Search products for &ldquo;{trimmed}&rdquo;
                </span>
              </CommandItem>
            </CommandGroup>
          )}

          {!trimmed && (
            <>
              <CommandGroup heading="Popular searches">
                {popularSearches.map((term) => (
                  <CommandItem
                    key={term}
                    value={`popular-${term}`}
                    onSelect={() => searchFor(term)}
                  >
                    <Search />
                    {term}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          <CommandGroup heading="Categories">
            {featuredCategories.map((category) => (
              <CommandItem
                key={category.href}
                value={`category-${category.label}`}
                keywords={[category.description]}
                onSelect={() => go(category.href)}
              >
                <Tag />
                {category.label}
                {category.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {category.badge}
                  </Badge>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />

          <CommandGroup heading="Pages">
            {navigationItems.map((item) => (
              <CommandItem
                key={item.href}
                value={`page-${item.label}`}
                onSelect={() => go(item.href)}
              >
                <item.icon />
                {item.label}
              </CommandItem>
            ))}
            <CommandItem
              value="page-all-categories"
              keywords={["browse", "categories"]}
              onSelect={() => go("/categories")}
            >
              <Tag />
              All categories
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />

          <CommandGroup heading="Your account">
            {accountLinks.map((item) => (
              <CommandItem
                key={item.href}
                value={`account-${item.label}`}
                onSelect={() => go(item.href)}
              >
                <item.icon />
                {item.label}
              </CommandItem>
            ))}
            <CommandItem
              value="account-wishlist"
              onSelect={() => go("/wishlist")}
            >
              <Tag />
              Wishlist
            </CommandItem>
          </CommandGroup>
        </CommandList>

        <div className="flex items-center justify-between border-t border-border px-3 py-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CornerDownLeft aria-hidden="true" className="size-3.5" />
            to select
          </span>
          <span>Esc to close</span>
        </div>
      </Command>
    </CommandDialog>
  )
}
