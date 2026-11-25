"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { baseApi } from "@/lib/api/base-api"
import { isUnauthorizedError } from "@/features/cart/hooks/cart-api"
import { useWishlistStore } from "@/features/wishlist/store/wishlist-store"

interface ServerWishlist {
  items: Array<{
    productId: string
    product: {
      id: string
      name: string
      price: string
      imageUrl: string | null
      isAvailable: boolean
    }
  }>
}

export interface WishlistItem {
  id: string
  name: string
  price: number
  imageUrl: string | null
  isAvailable: boolean
}

interface ProductDetail {
  id: string
  name: string
  sellingPrice: string | number
  images: Array<{ url?: string; imageUrl?: string }>
  variants?: Array<{ stock: number; isAvailable: boolean }>
}

export function useWishlistItems() {
  const queryClient = useQueryClient()
  const localIds = useWishlistStore((state) => state.productIds)
  const hydrated = useWishlistStore((state) => state.hydrated)
  const removeLocal = useWishlistStore((state) => state.remove)
  const clearLocal = useWishlistStore((state) => state.clear)
  const setLocalProductIds = useWishlistStore((state) => state.setProductIds)

  const query = useQuery({
    queryKey: ["wishlist-items"],
    enabled: hydrated,
    queryFn: async (): Promise<{ server: boolean; items: WishlistItem[] }> => {
      try {
        let wishlist = await baseApi.get<ServerWishlist>("/wishlist")
        const existingIds = new Set(
          wishlist.items.map((item) => item.productId)
        )
        for (const productId of localIds.filter((id) => !existingIds.has(id))) {
          wishlist = await baseApi.post<ServerWishlist>("/wishlist/items", {
            productId,
          })
        }
        const ids = wishlist.items.map((item) => item.productId)
        setLocalProductIds(ids)
        return {
          server: true,
          items: wishlist.items.map(({ product }) => ({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            imageUrl: product.imageUrl,
            isAvailable: product.isAvailable,
          })),
        }
      } catch (error) {
        if (!isUnauthorizedError(error)) throw error
        const products = await Promise.all(
          localIds.map(async (id) => {
            try {
              const product = await baseApi.get<ProductDetail>(
                `/store/products/${id}`
              )
              return {
                id: product.id,
                name: product.name,
                price: Number(product.sellingPrice),
                imageUrl:
                  product.images?.[0]?.url ??
                  product.images?.[0]?.imageUrl ??
                  null,
                isAvailable:
                  product.variants?.some(
                    (variant) => variant.isAvailable && variant.stock > 0
                  ) ?? true,
              }
            } catch {
              return null
            }
          })
        )
        return {
          server: false,
          items: products.filter((item): item is WishlistItem => item !== null),
        }
      }
    },
    staleTime: 30_000,
  })

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (query.data?.server) {
        await baseApi.delete(`/wishlist/items/${productId}`)
      } else {
        removeLocal(productId)
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wishlist-items"] })
      await queryClient.invalidateQueries({ queryKey: ["customer-wishlist"] })
      toast.success("Removed from wishlist")
    },
    onError: () => toast.error("Could not remove item from wishlist"),
  })

  const clearMutation = useMutation({
    mutationFn: async () => {
      if (query.data?.server) await baseApi.delete("/wishlist")
      clearLocal()
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wishlist-items"] })
      await queryClient.invalidateQueries({ queryKey: ["customer-wishlist"] })
      toast.success("Wishlist cleared")
    },
    onError: () => toast.error("Could not clear wishlist"),
  })

  return {
    items: query.data?.items ?? [],
    isLoading: !hydrated || query.isLoading,
    isError: query.isError,
    removeItem: (id: string) => removeMutation.mutate(id),
    clear: () => clearMutation.mutate(),
    isUpdating: removeMutation.isPending || clearMutation.isPending,
  }
}
