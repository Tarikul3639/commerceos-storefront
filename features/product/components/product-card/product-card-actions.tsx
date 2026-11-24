"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { ProductCardActionsProps } from "./product-card.types"
import { ProductVariantDialog } from "./product-variant-dialog"

export function ProductCardActions({
  product,
  image,
  sellingPrice,
  isOutOfStock,
  isHorizontal,
}: ProductCardActionsProps) {
  const [open, setOpen] = useState(false)
  const [buyNow, setBuyNow] = useState(false)

  const openDialog = (shouldBuyNow = false) => {
    if (isOutOfStock) return
    setBuyNow(shouldBuyNow)
    setOpen(true)
  }

  return (
    <>
      <div className={`mt-1 flex flex-wrap gap-2 ${isHorizontal ? "sm:mt-2" : ""}`}>
        <Button
          type="button"
          size="sm"
          variant={isHorizontal ? "outline" : isOutOfStock ? "secondary" : "default"}
          className={`relative isolate w-full overflow-hidden border-border bg-background text-foreground before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-primary before:transition-transform before:duration-300 before:ease-in-out hover:border-primary hover:bg-transparent hover:text-primary-foreground hover:before:scale-x-100 ${isHorizontal ? "sm:h-8 sm:w-auto sm:px-3" : "w-full"}`}
          disabled={isOutOfStock}
          onClick={() => openDialog()}
        >
          <ShoppingCart className="size-4" />
          {isOutOfStock ? "Out of Stock" : "Add To Cart"}
        </Button>

        {isHorizontal && (
          <Button
            type="button"
            className="hidden bg-primary text-primary-foreground hover:bg-primary/80 sm:inline-flex sm:h-8 sm:w-auto sm:px-3"
            disabled={isOutOfStock}
            onClick={() => openDialog(true)}
          >
            <ShoppingCart className="size-4" />
            Buy Now
          </Button>
        )}
      </div>

      <ProductVariantDialog
        open={open}
        onOpenChange={setOpen}
        product={product}
        image={image}
        sellingPrice={sellingPrice}
        buyNow={buyNow}
      />
    </>
  )
}
