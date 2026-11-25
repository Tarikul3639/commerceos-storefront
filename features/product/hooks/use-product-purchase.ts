"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useCart } from "@/features/cart/hooks/use-cart"
import type {
  StoreProductDetailResponse,
  StoreProductVariant,
} from "@/features/product/types"
import { getApiErrorMessage } from "@/lib/api/api-error"

interface UseProductPurchaseOptions {
  productId: string
  data: StoreProductDetailResponse | undefined
  selectedVariant: StoreProductVariant | null
  availableStock: number
  isOutOfStock: boolean
}

export function useProductPurchase({
  productId,
  data,
  selectedVariant,
  availableStock,
  isOutOfStock,
}: UseProductPurchaseOptions) {
  const router = useRouter()
  const { addItem, isAdding, items: cartItems } = useCart()
  const [quantity, setQuantity] = useState(1)

  const quantityInCart = cartItems
    .filter(
      (item) =>
        item.productId === productId &&
        item.variantId === (selectedVariant?.id ?? null)
    )
    .reduce((total, item) => total + item.quantity, 0)

  const remainingStock = Math.max(0, availableStock - quantityInCart)
  const safeQuantity = Math.min(
    Math.max(quantity, 1),
    Math.max(remainingStock, 1)
  )

  const handleAddToCart = async (buyNow = false) => {
    if (!data || isOutOfStock || remainingStock < 1) {
      toast.error("This selected variant is currently out of stock.")
      return
    }

    try {
      const addedQuantity = await addItem({
        productId: data.id,
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
        name: data.name,
        price: Number(data.sellingPrice),
        imageUrl: data.images[0]?.imageUrl ?? null,
      })

      toast.success(
        addedQuantity < safeQuantity
          ? `Added ${addedQuantity} item(s). Maximum available stock reached.`
          : "Added to cart"
      )

      if (buyNow && addedQuantity > 0) router.push("/checkout")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to add product to cart."))
    }
  }

  return {
    quantity,
    setQuantity,
    remainingStock,
    safeQuantity,
    isAdding,
    handleAddToCart,
  }
}
