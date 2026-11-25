"use client"

import { useEffect, useRef } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { baseApi } from "@/lib/api/base-api"
import { isUnauthorizedError } from "@/features/cart/hooks/cart-api"
import { useWishlistStore } from "@/features/wishlist/store/wishlist-store"

interface WishlistResponse {
  items: Array<{ productId: string }>
}

export const WISHLIST_QUERY_KEY = ["customer-wishlist"] as const

export function useProductWishlist(productId: string) {
  const queryClient = useQueryClient()
  const productIds = useWishlistStore((state) => state.productIds)
  const hydrated = useWishlistStore((state) => state.hydrated)
  const addLocal = useWishlistStore((state) => state.add)
  const removeLocal = useWishlistStore((state) => state.remove)
  const setLocalProductIds = useWishlistStore((state) => state.setProductIds)
  const mergedForSession = useRef(false)

  const { data: serverWishlist, isSuccess } = useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: async () => {
      try {
        return await baseApi.get<WishlistResponse>("/wishlist")
      } catch (error) {
        if (isUnauthorizedError(error)) return null
        throw error
      }
    },
    retry: false,
    staleTime: 0,
    refetchOnMount: "always",
  })

  useEffect(() => {
    if (!hydrated || !isSuccess || !serverWishlist || mergedForSession.current)
      return

    const mergeGuestWishlist = async () => {
      mergedForSession.current = true
      const serverIds = new Set(
        serverWishlist.items.map((item) => item.productId)
      )
      const guestIds = productIds.filter((id) => !serverIds.has(id))

      try {
        let latestWishlist = serverWishlist
        for (const guestProductId of guestIds) {
          latestWishlist = await baseApi.post<WishlistResponse>(
            "/wishlist/items",
            {
              productId: guestProductId,
            }
          )
        }
        if (guestIds.length > 0)
          queryClient.setQueryData(WISHLIST_QUERY_KEY, latestWishlist)
        setLocalProductIds(latestWishlist.items.map((item) => item.productId))
      } catch {
        mergedForSession.current = false
        toast.error("Could not sync your saved favorites. Please try again.")
      }
    }

    void mergeGuestWishlist()
  }, [
    hydrated,
    isSuccess,
    serverWishlist,
    productIds,
    queryClient,
    setLocalProductIds,
  ])

  const mutation = useMutation({
    mutationFn: async (shouldRemove: boolean) => {
      if (serverWishlist) {
        return shouldRemove
          ? baseApi.delete<WishlistResponse>(`/wishlist/items/${productId}`)
          : baseApi.post<WishlistResponse>("/wishlist/items", { productId })
      }
      if (shouldRemove) removeLocal(productId)
      else addLocal(productId)
      return null
    },
    onSuccess: async (wishlist, shouldRemove) => {
      if (wishlist) {
        queryClient.setQueryData(WISHLIST_QUERY_KEY, wishlist)
        setLocalProductIds(wishlist.items.map((item) => item.productId))
      }

      // The wishlist sheet and page use a separate query cache.
      // Refetch it after a successful add/remove so the UI updates without reload.
      await queryClient.invalidateQueries({
        queryKey: ["wishlist-items"],
      })

      toast.success(
        shouldRemove ? "Removed from wishlist" : "Added to wishlist"
      )
    },
    onError: () =>
      toast.error("Could not update your wishlist. Please try again."),
  })

  const isFavorite = serverWishlist
    ? serverWishlist.items.some((item) => item.productId === productId)
    : productIds.includes(productId)

  return {
    isFavorite,
    isUpdatingFavorite: mutation.isPending || !hydrated,
    toggleFavorite: () => mutation.mutate(isFavorite),
  }
}
