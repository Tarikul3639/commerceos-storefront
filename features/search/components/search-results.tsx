"use client"

import Image from "next/image"
import { Package } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"
import type {
  StoreProductSearchResponse,
} from "../types/search.types"

type SearchResultsProps = {
  query: string
  data?: StoreProductSearchResponse
  isFetching: boolean
  isError: boolean
  onSelectProduct: (productId: string) => void
  onViewAll: () => void
}

/** Displays live product matches returned by the storefront search endpoint. */
export function SearchResults({
  query,
  data,
  isFetching,
  isError,
  onSelectProduct,
  onViewAll,
}: SearchResultsProps) {
  if (isFetching) {
    return (
      <CommandGroup heading="Searching products">
        <p className="px-3 py-8 text-center text-xs text-muted-foreground">
          Searching for “{query}”...
        </p>
      </CommandGroup>
    )
  }

  if (isError) {
    return (
      <CommandGroup heading="Products">
        <p className="px-3 py-8 text-center text-xs text-destructive">
          Search is temporarily unavailable. Please try again.
        </p>
      </CommandGroup>
    )
  }

  if (!data?.data.length) {
    return (
      <CommandGroup heading="Products">
        <CommandEmpty className="py-10">
          No products found for “{query}”.
        </CommandEmpty>
      </CommandGroup>
    )
  }

  return (
    <>
      <CommandGroup heading="Products">
        {data.data.map((product) => {
          const image = product.images[0]

          return (
            <CommandItem
              key={product.id}
              value={`${product.name} ${product.brandName ?? ""} ${product.categoryName}`}
              onSelect={() => onSelectProduct(product.id)}
              className="h-auto min-h-20 gap-3 rounded-lg px-2.5 py-2.5"
            >
              <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
                {image ? (
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex size-full items-center justify-center">
                    <Package className="size-5 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <p className="line-clamp-1 text-sm font-medium text-foreground">
                  {product.name}
                </p>
                <p className="line-clamp-1 text-xs text-muted-foreground">
                  {product.brandName
                    ? `${product.brandName} · ${product.categoryName}`
                    : product.categoryName}
                </p>
                {product.subDescription ? (
                  <p className="line-clamp-1 text-[11px] text-muted-foreground">
                    {product.subDescription}
                  </p>
                ) : null}
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1 pr-1">
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  ৳{Number(product.sellingPrice).toLocaleString("en-BD")}
                </span>
                {product.originalPrice ? (
                  <span className="text-[11px] text-muted-foreground line-through">
                    ৳{Number(product.originalPrice).toLocaleString("en-BD")}
                  </span>
                ) : null}
                {product.stock < 1 ? (
                  <Badge variant="secondary" className="text-[10px]">
                    Out of stock
                  </Badge>
                ) : null}
              </div>
            </CommandItem>
          )
        })}
      </CommandGroup>

      <CommandSeparator className="my-2" />
      <CommandGroup>
        <CommandItem
          value="view-all-search-results"
          onSelect={onViewAll}
          className="justify-center rounded-lg py-3 text-xs font-medium text-primary"
        >
          View all {data.total} matching products
        </CommandItem>
      </CommandGroup>
    </>
  )
}
