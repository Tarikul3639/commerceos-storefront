import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"

import { baseApi } from "@/lib/api/base-api"
import { useCartStore } from "@/features/cart/store/cart-store"
import type { CartStockResponse } from "./cart-api"

interface CartStockRequestItem {
  productId: string
  variantId: string | null
}

interface UseCartStockParams {
  hydrated: boolean
  items: CartStockRequestItem[]
}

/** Keep cart line stock synchronized for both guest and authenticated carts. */
export function useCartStock({ hydrated, items }: UseCartStockParams) {
  const updateStock = useCartStore((state) => state.updateStock)
  const stockRequestItems = items.map(({ productId, variantId }) => ({
    productId,
    variantId,
  }))

  const stockQuery = useQuery({
    queryKey: ["cart-stock", stockRequestItems],
    queryFn: ({ signal }) =>
      baseApi.post<CartStockResponse>(
        "/store/products/cart-stock",
        { items: stockRequestItems },
        { signal }
      ),
    enabled: hydrated && stockRequestItems.length > 0,
    staleTime: 0,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  })

  useEffect(() => {
    if (stockQuery.data?.items) {
      updateStock(stockQuery.data.items)
    }
  }, [stockQuery.data, updateStock])

  return stockQuery
}
