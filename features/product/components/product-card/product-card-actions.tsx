"use client"

import { useRouter } from "next/navigation"
import { ShoppingCart } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useCart } from "@/features/cart/hooks/use-cart"
import type { ProductCardActionsProps } from "./product-card.types"

export function ProductCardActions({
  product,
  image,
  sellingPrice,
  isOutOfStock,
  isHorizontal,
}: ProductCardActionsProps) {
  const router = useRouter()
  const { addItem, isAdding } = useCart()

  const handleAction = async (buyNow = false) => {
    if (isOutOfStock || isAdding) return

    try {
      await addItem({
        productId: product.id,
        variantId: null,
        quantity: 1,
        stock: product.stock,
        name: product.name,
        price: sellingPrice,
        imageUrl: image ?? null,
      })

      if (buyNow) router.push("/checkout")
      else toast.success("Added to cart")
    } catch {
      toast.error(
        buyNow
          ? "Could not proceed. Please try again."
          : "Could not add this product to cart"
      )
    }
  }

  return (
    <div
      className={`mt-1 flex flex-wrap gap-2 ${isHorizontal ? "sm:mt-2" : ""}`}
    >
      <Button
        type="button"
        size="sm"
        variant={
          isHorizontal ? "outline" : isOutOfStock ? "secondary" : "default"
        }
        className={
          isHorizontal
            ? `relative isolate w-full overflow-hidden border-border bg-background text-foreground before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-primary before:transition-transform before:duration-300 before:ease-in-out hover:border-primary hover:bg-transparent hover:text-primary-foreground hover:before:scale-x-100 sm:h-8 sm:w-auto sm:px-3`
            : "w-full"
        }
        disabled={isAdding || isOutOfStock}
        onClick={() => handleAction()}
      >
        <ShoppingCart className="size-4" />
        {isOutOfStock ? "Out of Stock" : isAdding ? "Adding..." : "Add To Cart"}
      </Button>

      {isHorizontal && (
        <Button
          type="button"
          className="hidden bg-primary text-primary-foreground hover:bg-primary/80 sm:inline-flex sm:h-8 sm:w-auto sm:px-3"
          disabled={isAdding || isOutOfStock}
          onClick={() => handleAction(true)}
        >
          <ShoppingCart className="size-4" />
          Buy Now
        </Button>
      )}
    </div>
  )
}
