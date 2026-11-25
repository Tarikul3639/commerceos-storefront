"use client"

import Image from "next/image"
import {
  ArrowRight,
  CircleAlert,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { useProductVariantDialog } from "@/features/product/hooks/use-product-variant-dialog"
import { isVariantValueAvailable } from "@/features/product/utils/product-variant-dialog.utils"

interface ProductVariantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: {
    id: string
    name: string
    stock: number
  }
  image?: string | null
  sellingPrice: number
  buyNow?: boolean
}

export function ProductVariantDialog({
  open,
  onOpenChange,
  product,
  image,
  sellingPrice,
  buyNow = false,
}: ProductVariantDialogProps) {
  const {
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
    isAdding,
    close,
    selectValue,
    handleQuantityDecrease,
    handleQuantityIncrease,
    handleAddToCart,
  } = useProductVariantDialog({
    open,
    onOpenChange,
    product,
    image,
    sellingPrice,
    buyNow,
  })

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader className="pr-7">
          <DialogTitle className="text-base">
            Choose product options
          </DialogTitle>
          <DialogDescription>
            Select the available variant and quantity before adding this item to
            your cart.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-3 py-5">
            <div className="h-4 w-2/3 animate-pulse bg-muted" />
            <div className="h-9 animate-pulse bg-muted" />
            <div className="h-9 animate-pulse bg-muted" />
          </div>
        ) : isError || !data ? (
          <div className="py-6 text-sm text-muted-foreground">
            Could not load product options. Please close and try again.
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex gap-3 border-b border-border pb-4">
              <div className="relative size-20 shrink-0 overflow-hidden bg-muted">
                {currentImage && (
                  <Image
                    src={currentImage}
                    alt={product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="line-clamp-2 text-sm font-medium">{data.name}</p>
                <p className="mt-1 text-sm font-semibold text-primary">
                  ৳{currentPrice.toLocaleString("en-BD")}
                </p>
              </div>
            </div>

            {showStockAlert ? (
              <Alert variant="destructive" role="alert">
                <CircleAlert />
                <AlertDescription>{stockMessage}</AlertDescription>
              </Alert>
            ) : quantityInCart > 0 && remainingStock >= 1 ? (
              <p className="text-xs text-muted-foreground">
                You already have {quantityInCart} in your cart. You can add{" "}
                {remainingStock} more.
              </p>
            ) : null}

            {hasOptions ? (
              <div className="space-y-4">
                {data.options.map((option) => {
                  const isColor = option.type === "COLOR"
                  const selectedValueId = selection[option.id]

                  return (
                    <div key={option.id} className="space-y-2">
                      <Label className="text-xs font-semibold uppercase">
                        {option.name}:{" "}
                        <span className="font-normal text-primary">
                          {option.values.find(
                            (value) => value.id === selectedValueId
                          )?.label ?? `Select ${option.name.toLowerCase()}`}
                        </span>
                      </Label>

                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                          const active = selectedValueId === value.id
                          const available = isVariantValueAvailable(
                            data.variants,
                            selection,
                            option.id,
                            value.id
                          )

                          return (
                            <Button
                              key={value.id}
                              type="button"
                              variant={
                                !isColor && active ? "default" : "outline"
                              }
                              size={isColor ? "icon" : "sm"}
                              onClick={() => selectValue(option.id, value.id)}
                              aria-pressed={active}
                              aria-label={
                                isColor
                                  ? `Select color ${value.label}`
                                  : undefined
                              }
                              title={value.label}
                              className={cn(
                                "relative",
                                isColor
                                  ? [
                                      "hover:border-primary!",
                                      active &&
                                        "border-2! border-primary! p-0.5",
                                    ]
                                  : "min-w-8 overflow-hidden",
                                !available && "opacity-50"
                              )}
                            >
                              {isColor ? (
                                <span
                                  aria-hidden="true"
                                  className="block h-full w-full border border-border/50"
                                  style={{
                                    backgroundColor:
                                      value.colorCode ?? "transparent",
                                  }}
                                />
                              ) : (
                                value.label
                              )}

                              {!available && (
                                <span className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                                  <span className="h-[1.5px] w-[140%] -rotate-45 bg-muted-foreground/40" />
                                </span>
                              )}
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}

                {Object.keys(selection).length === data.options.length &&
                  !selectedVariant && (
                    <p className="text-xs text-destructive">
                      This combination is not available.
                    </p>
                  )}
                {isVariantOutOfStock && (
                  <p className="text-xs text-destructive">
                    This variant is out of stock.
                  </p>
                )}
                {selectedVariant?.sku && (
                  <p className="text-xs text-muted-foreground">
                    SKU: {selectedVariant.sku}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {availableStock > 0
                  ? `${availableStock} items available`
                  : "Out of stock"}
              </p>
            )}

            <div
              role="group"
              aria-labelledby={`quantity-label-${product.id}`}
              className="flex items-center justify-between"
            >
              <Label id={`quantity-label-${product.id}`}>Quantity</Label>
              <div className="flex items-center border border-border">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Decrease quantity"
                  disabled={safeQuantity <= 1}
                  onClick={handleQuantityDecrease}
                >
                  <Minus className="size-3.5" />
                </Button>
                <span
                  aria-live="polite"
                  className="min-w-8 text-center text-sm tabular-nums"
                >
                  {safeQuantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Increase quantity"
                  onClick={handleQuantityIncrease}
                >
                  <Plus className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={
              !data || isError || !canAdd || isVariantOutOfStock || isAdding
            }
            onClick={handleAddToCart}
          >
            <ShoppingCart className="size-4" />
            {isAdding
              ? "Adding..."
              : buyNow
                ? "Continue to checkout"
                : "Add to cart"}
            {!isAdding && <ArrowRight className="size-4" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
