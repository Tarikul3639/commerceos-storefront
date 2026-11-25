"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import type { StoreProductDetailResponse } from "@/features/product/types"
import type { ProductSelection } from "../types/product.types"
import { baseApi } from "@/lib/api/base-api"
import { getProductSizeGuide } from "../utils/product-size-guide.utils"
import { matchesProductVariantSelection } from "../utils/product-variant.utils"

interface UseProductDetailsOptions {
  productId: string
  initialSku: string | null
}

export function useProductDetails({
  productId,
  initialSku,
}: UseProductDetailsOptions) {
  const router = useRouter()
  const [userProductSelection, setUserProductSelection] =
    useState<ProductSelection | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["store-product-details", productId],
    queryFn: ({ signal }) =>
      baseApi.get<StoreProductDetailResponse>(`/store/products/${productId}`, {
        signal,
      }),
    staleTime: 60_000,
  })

  const initialVariant = useMemo(() => {
    if (!data?.variants.length) return null

    return (
      data.variants.find((variant) => variant.sku === initialSku) ??
      data.variants.find(
        (variant) => variant.isAvailable && variant.stock > 0
      ) ??
      data.variants[0] ??
      null
    )
  }, [data, initialSku])

  const defaultProductSelection = useMemo<ProductSelection>(() => {
    if (!initialVariant) return {}

    return Object.fromEntries(
      initialVariant.options.map((option) => [option.optionId, option.id])
    )
  }, [initialVariant])

  const selection = userProductSelection ?? defaultProductSelection
  const hasOptions = Boolean(data?.options.length)

  const selectedVariant = useMemo(() => {
    if (
      !data?.options.length ||
      Object.keys(selection).length !== data.options.length
    ) {
      return null
    }

    return (
      data.variants.find((variant) =>
        matchesProductVariantSelection(variant, selection)
      ) ?? null
    )
  }, [data, selection])

  const availableStock = hasOptions
    ? (selectedVariant?.stock ?? 0)
    : (data?.variants.reduce((total, variant) => total + variant.stock, 0) ?? 0)

  const isOutOfStock = hasOptions
    ? !selectedVariant ||
      !selectedVariant.isAvailable ||
      selectedVariant.stock < 1
    : availableStock < 1

  const sizeGuide = getProductSizeGuide(data?.sizeGuide ?? null)
  const totalStock =
    data?.variants.reduce((total, variant) => total + variant.stock, 0) ?? 0

  const handleProductSelection = (nextSelection: ProductSelection) => {
    setUserProductSelection(nextSelection)

    if (!data || Object.keys(nextSelection).length !== data.options.length) {
      return
    }

    const matchedVariant = data.variants.find((variant) =>
      matchesProductVariantSelection(variant, nextSelection)
    )

    if (matchedVariant) {
      router.replace(
        `/products/${productId}?sku=${encodeURIComponent(matchedVariant.sku)}`,
        { scroll: false }
      )
    }
  }

  return {
    data,
    isLoading,
    isError,
    selection,
    hasOptions,
    selectedVariant,
    availableStock,
    isOutOfStock,
    sizeGuide,
    totalStock,
    handleProductSelection,
  }
}
