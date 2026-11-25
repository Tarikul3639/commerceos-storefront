"use client"

import { useQuery } from "@tanstack/react-query"
import { searchStoreProducts } from "../api/search.api"

export function useStoreProductSearch(query: string) {
  const normalizedQuery = query.trim()

  return useQuery({
    queryKey: ["store-product-search", normalizedQuery],
    queryFn: ({ signal }) => searchStoreProducts(normalizedQuery, signal),
    enabled: normalizedQuery.length >= 2,
    staleTime: 30_000,
    gcTime: 2 * 60_000,
  })
}
