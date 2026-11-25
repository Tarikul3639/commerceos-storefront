"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import {
  ArrowRight,
  CircleAlert,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react"
import { toast } from "sonner"

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
import { useCart } from "@/features/cart/hooks/use-cart"
import type {
  StoreProductDetailResponse,
  StoreProductVariant,
} from "@/features/product/types"
import { baseApi } from "@/lib/api/base-api"
import { getApiErrorMessage } from "@/lib/api/api-error"
import { cn } from "@/lib/utils"

/** optionId -> selected valueId */
type Selection = Record<string, string>

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

/** True when the variant contains every option value picked so far. */
function matchesSelection(variant: StoreProductVariant, selection: Selection) {
  return Object.entries(selection).every(([optionId, valueId]) =>
    variant.options.some(
      (option) => option.optionId === optionId && option.id === valueId
    )
  )
}

export function ProductVariantDialog({
  open,
  onOpenChange,
  product,
  image,
  sellingPrice,
  buyNow = false,
}: ProductVariantDialogProps) {
  const router = useRouter()
  const { addItem, isAdding, items: cartItems } = useCart()
  // null until the user picks something; until then the default variant is used.
  const [userSelection, setUserSelection] = useState<Selection | null>(null)
  const [quantity, setQuantity] = useState(1)
  // Only turned on by clicking "Add to cart" or "+" at the stock limit.
  const [showStockAlert, setShowStockAlert] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["store-product-details", product.id],
    queryFn: ({ signal }) =>
      baseApi.get<StoreProductDetailResponse>(`/store/products/${product.id}`, { signal }),
    enabled: open,
    staleTime: 0,
    refetchOnMount: true,
  })

  const hasOptions = Boolean(data?.options.length)

  // Pre-select the first available variant so an in-stock option is chosen initially.
  const defaultSelection = useMemo<Selection>(() => {
    const variant = data?.variants.find(
      (item) => item.isAvailable && item.stock > 0
    )

    return Object.fromEntries(
      variant?.options.map((option) => [option.optionId, option.id]) ?? []
    )
  }, [data])
  const selection = userSelection ?? defaultSelection

  const selectedVariant = useMemo(() => {
    if (!data?.options.length) return null
    if (Object.keys(selection).length !== data.options.length) return null

    return (
      data.variants.find((variant) => matchesSelection(variant, selection)) ??
      null
    )
  }, [data, selection])

  const canAdd = !hasOptions || Boolean(selectedVariant)
  const isVariantOutOfStock = Boolean(
    selectedVariant && !selectedVariant.isAvailable
  )

  const availableStock = hasOptions
    ? (selectedVariant?.stock ?? 0)
    : product.stock
  const quantityInCart = cartItems
    .filter(
      (item) =>
        item.productId === product.id &&
        item.variantId === (selectedVariant?.id ?? null)
    )
    .reduce((total, item) => total + item.quantity, 0)
  const remainingStock = Math.max(0, availableStock - quantityInCart)

  // Keeps the shown quantity valid when the user switches to a variant with less stock.
  const safeQuantity = Math.min(
    Math.max(quantity, 1),
    Math.max(remainingStock, 1)
  )

  const currentPrice = data ? Number(data.sellingPrice) : sellingPrice
  const currentImage = data?.images[0]?.imageUrl ?? image ?? null

  const stockMessage =
    remainingStock < 1
      ? quantityInCart > 0
        ? "You've already added the maximum available stock of this variant to your cart."
        : "This product is currently out of stock."
      : quantityInCart > 0
        ? `You already have ${quantityInCart} in your cart. Only ${remainingStock} more can be added.`
        : `Only ${availableStock} in stock.`

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setShowStockAlert(false)
        onOpenChange(next)
      }}
    >
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
                          const available = data.variants.some(
                            (variant) =>
                              variant.isAvailable &&
                              variant.stock > 0 &&
                              matchesSelection(variant, {
                                ...selection,
                                [option.id]: value.id,
                              })
                          )

                          return (
                            <Button
                              key={value.id}
                              type="button"
                              variant={!isColor && active ? "default" : "outline"}
                              size={isColor ? "icon" : "sm"}
                              onClick={() => {
                                setUserSelection({
                                  ...selection,
                                  [option.id]: value.id,
                                })
                                setShowStockAlert(false)
                              }}
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
                                      active && "border-2! border-primary! p-0.5",
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
                  onClick={() => {
                    setQuantity(safeQuantity - 1)
                    setShowStockAlert(false)
                  }}
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
                  onClick={() => {
                    if (safeQuantity >= remainingStock) {
                      setShowStockAlert(true)
                      return
                    }
                    setQuantity(safeQuantity + 1)
                  }}
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
            onClick={async () => {
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
                toast.error(
                  getApiErrorMessage(error, "Failed to add product to cart.")
                )
              }
            }}
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