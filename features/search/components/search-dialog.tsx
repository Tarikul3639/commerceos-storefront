"use client"

import { useCallback, useEffect, useState } from "react"
import { CornerDownLeft, LoaderCircle, Search, X } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
} from "@/components/ui/command"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

import { useStoreProductSearch } from "../hooks/use-store-product-search"
import { SearchResults } from "./search-results"
import { SearchSuggestions } from "./search-suggestions"

type SearchDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Search dialog orchestration: input state, query lifecycle and navigation. */
export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  const trimmedQuery = query.trim()

  // The search hook owns API state through TanStack Query.
  const { data, isFetching, isError } = useStoreProductSearch(debouncedQuery)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(trimmedQuery)
    }, 250)

    return () => window.clearTimeout(timeout)
  }, [trimmedQuery])

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setQuery("")
        setDebouncedQuery("")
      }

      onOpenChange(nextOpen)
    },
    [onOpenChange]
  )

  const navigate = useCallback(
    (href: string) => {
      handleOpenChange(false)
      router.push(href)
    },
    [handleOpenChange, router]
  )

  const searchFor = useCallback(
    (term: string) => {
      navigate(`/search?search=${encodeURIComponent(term)}`)
    },
    [navigate]
  )

  const waitingForDebounce =
    trimmedQuery.length >= 2 && trimmedQuery !== debouncedQuery

  const searching = waitingForDebounce || isFetching

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Search the store"
      description="Search products by name, description, category, brand or SKU"
      className="top-[10%] max-w-[95vw] translate-y-0 sm:top-[12%] sm:max-w-xl"
      showCloseButton={false}
    >
      <Command shouldFilter={false} className="rounded-xl">
        {/* Search input */}
        <div className="relative border-b px-2 py-2">
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="Search products, brands, categories or SKU..."
            className="h-12 pr-5 text-sm sm:text-base [&+div[data-slot=input-group-addon]]:opacity-0"
          />

          <div className="absolute top-1/2 left-5 -translate-y-1/2">
            {searching ? (
              <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
            ) : (
              <Search className="size-4 text-muted-foreground" />
            )}
          </div>

          {/* Clear button */}
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                setDebouncedQuery("")
              }}
              aria-label="Clear search"
              className="absolute top-1/2 right-4 -translate-y-1/2 rounded-sm p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Scrollable content */}
        <ScrollArea className="h-[min(62vh,36rem)]">
          <CommandList className="max-h-none overflow-visible px-2 py-2">
            {trimmedQuery.length >= 2 ? (
              <SearchResults
                query={debouncedQuery || trimmedQuery}
                data={data}
                isFetching={searching}
                isError={isError}
                onSelectProduct={(productId) =>
                  navigate(`/products/${productId}`)
                }
                onViewAll={() => searchFor(trimmedQuery)}
              />
            ) : (
              <SearchSuggestions onSearch={searchFor} onNavigate={navigate} />
            )}
          </CommandList>

          <ScrollBar orientation="vertical" />
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
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
