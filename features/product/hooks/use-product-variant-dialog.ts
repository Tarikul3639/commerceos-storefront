"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCart } from "@/features/cart/hooks/use-cart"
import type {
  StoreProductDetailResponse,
  StoreProductVariant,
} from "@/features/product/types"
import { baseApi } from "@/lib/api/base-api"
import { getApiErrorMessage } from "@/lib/api/api-error"
import {
  getVariantStockMessage,
  matchesVariantSelection,
} from "../utils/product-variant-dialog.utils"

interface ProductVariantDialogOptions {
  open: boolean
  product: { id: string; name: string; stock: number }
  image?: string | null
  sellingPrice: number
  onOpenChange: (open: boolean) => void
  buyNow: boolean
}

type Selection = Record<string, string>

export function useProductVariantDialog({
  open,
  product,
  image,
  sellingPrice,
  onOpenChange,
  buyNow,
}: ProductVariantDialogOptions) {
  const router = useRouter()
  const { addItem, isAdding, items: cartItems } = useCart()
  const [userSelection, setUserSelection] = useState<Selection | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [showStockAlert, setShowStockAlert] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["store-product-details", product.id],
    queryFn: ({ signal }) =>
      baseApi.get<StoreProductDetailResponse>(`/store/products/${product.id}`, {
        signal,
      }),
    enabled: open,
    staleTime: 0,
    refetchOnMount: true,
  })

  const hasOptions = Boolean(data?.options.length)

  // Start with the first purchasable variant so the dialog opens in a valid state.
  const defaultSelection = useMemo<Selection>(() => {
    const variant = data?.variants.find(
      (item) => item.isAvailable && item.stock > 0
    )
    return Object.fromEntries(
      variant?.options.map((option) => [option.optionId, option.id]) ?? []
    )
  }, [data])
  const selection = userSelection ?? defaultSelection

  const selectedVariant = useMemo<StoreProductVariant | null>(() => {
    if (
      !data?.options.length ||
      Object.keys(selection).length !== data.options.length
    )
      return null
    return (
      data.variants.find((variant) =>
        matchesVariantSelection(variant, selection)
      ) ?? null
    )
  }, [data, selection])

  const canAdd = !hasOptions || Boolean(selectedVariant)
  const isVariantOutOfStock = hasOptions
    ? Boolean(selectedVariant && !selectedVariant.isAvailable)
    : Boolean(data?.variants[0] && !data.variants[0].isAvailable)
  // Products without configurable options still use their default variant stock.
  const availableStock = hasOptions
    ? (selectedVariant?.stock ?? 0)
    : (data?.variants[0]?.stock ?? product.stock)
  const quantityInCart = cartItems
    .filter(
      (item) =>
        item.productId === product.id &&
        item.variantId === (selectedVariant?.id ?? null)
    )
    .reduce((total, item) => total + item.quantity, 0)
  // Quantities already in the cart count against the stock available for this variant.
  const remainingStock = Math.max(0, availableStock - quantityInCart)

  // Clamp the displayed quantity when the selected variant or cart stock changes.
  const safeQuantity = Math.min(
    Math.max(quantity, 1),
    Math.max(remainingStock, 1)
  )
  const currentPrice = data ? Number(data.sellingPrice) : sellingPrice
  const currentImage = data?.images[0]?.imageUrl ?? image ?? null
  const stockMessage = getVariantStockMessage(
    remainingStock,
    quantityInCart,
    availableStock
  )

  const selectValue = (optionId: string, valueId: string) => {
    setUserSelection({ ...selection, [optionId]: valueId })
    setShowStockAlert(false)
  }

  const close = (next: boolean) => {
    setShowStockAlert(false)
    onOpenChange(next)
  }

  const handleQuantityDecrease = () => {
    setQuantity(safeQuantity - 1)
    setShowStockAlert(false)
  }

  const handleQuantityIncrease = () => {
    if (safeQuantity >= remainingStock) {
      setShowStockAlert(true)
      return
    }
    setQuantity(safeQuantity + 1)
  }

  const handleAddToCart = async () => {
    if (remainingStock < 1) {
      setShowStockAlert(true)
      return
    }
    setShowStockAlert(false)
    try {
      const addedQuantity = await addItem({
        productId: product.id,
        variantId: selectedVariant?.id ?? null,
        variant: selectedVariant
          ? {
              id: selectedVariant.id,
              sku: selectedVariant.sku,
              stock: selectedVariant.stock,
              options: selectedVariant.options,
            }
          : null,
        quantity: safeQuantity,
        stock: availableStock,
        name: product.name,
        price: currentPrice,
        imageUrl: currentImage,
      })
      onOpenChange(false)
      if (buyNow) router.push("/checkout")
      else
        toast.success(
          addedQuantity < safeQuantity
            ? `Added ${addedQuantity} item(s). Maximum available stock reached.`
            : "Added to cart"
        )
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to add product to cart."))
    }
  }

  return {
    data,
    isLoading,
    isError,
    hasOptions,
    selection,
    selectedVariant,
    canAdd,
    isVariantOutOfStock,
    availableStock,
    quantityInCart,
    remainingStock,
    safeQuantity,
    currentPrice,
    currentImage,
    stockMessage,
    showStockAlert,
    setShowStockAlert,
    isAdding,
    close,
    selectValue,
    handleQuantityDecrease,
    handleQuantityIncrease,
    handleAddToCart,
  }
}
