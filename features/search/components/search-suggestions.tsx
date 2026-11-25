"use client"

import { Badge } from "@/components/ui/badge"
import {
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"
import {
  accountLinks,
  featuredCategories,
  navigationItems,
  popularSearches,
} from "../data/search.constants"

type SearchSuggestionsProps = {
  onSearch: (term: string) => void
  onNavigate: (href: string) => void
}

/** Popular terms and storefront shortcuts shown before a search is entered. */
export function SearchSuggestions({
  onSearch,
  onNavigate,
}: SearchSuggestionsProps) {
  return (
    <>
      <CommandGroup heading="Popular searches">
        {popularSearches.map((term) => (
          <CommandItem
            key={term}
            value={`popular-${term}`}
            onSelect={() => onSearch(term)}
          >
            <span className="text-muted-foreground">⌕</span>
            {term}
          </CommandItem>
        ))}
      </CommandGroup>

      <CommandSeparator />

      <CommandGroup heading="Categories">
        {featuredCategories.map((category) => (
          <CommandItem
            key={category.href}
            value={`category-${category.label}`}
            onSelect={() => onNavigate(category.href)}
          >
            <span className="text-muted-foreground">#</span>
            {category.label}
            {category.badge ? (
              <Badge variant="secondary" className="ml-auto">
                {category.badge}
              </Badge>
            ) : null}
          </CommandItem>
        ))}
      </CommandGroup>

      <CommandSeparator />

      <CommandGroup heading="Pages">
        {navigationItems.map((item) => (
          <CommandItem
            key={item.href}
            value={`page-${item.label}`}
            onSelect={() => onNavigate(item.href)}
          >
            <item.icon />
            {item.label}
          </CommandItem>
        ))}
        <CommandItem
          value="page-all-categories"
          keywords={["browse", "categories"]}
          onSelect={() => onNavigate("/categories")}
        >
          <span className="text-muted-foreground">#</span>
          All categories
        </CommandItem>
      </CommandGroup>

      <CommandSeparator />

      <CommandGroup heading="Your account">
        {accountLinks.map((item) => (
          <CommandItem
            key={item.href}
            value={`account-${item.label}`}
            onSelect={() => onNavigate(item.href)}
          >
            <item.icon />
            {item.label}
          </CommandItem>
        ))}
        <CommandItem
          value="account-wishlist"
          onSelect={() => onNavigate("/wishlist")}
        >
          <span className="text-muted-foreground">♡</span>
          Wishlist
        </CommandItem>
      </CommandGroup>
    </>
  )
}
