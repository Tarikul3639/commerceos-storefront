"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { ArrowRight, Minus, Plus, ShoppingCart } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useCart } from "@/features/cart/hooks/use-cart"
import { baseApi } from "@/lib/api/base-api"

interface ProductOptionValue {
  id: string
  label: string
  colorCode: string | null
}

interface ProductOption {
  id: string
  name: string
  type: string
  values: ProductOptionValue[]
}

interface ProductVariantOption {
  id: string
  label: string
  colorCode: string | null
  optionId: string
  optionName: string
  optionType: string
}

interface ProductVariant {
  id: string
  sku: string
  stock: number
  isAvailable: boolean
  options: ProductVariantOption[]
}

interface ProductDetails {
  id: string
  name: string
  sellingPrice: string
  originalPrice: string | null
  images: { id: string; imageUrl: string }[]
  options: ProductOption[]
  variants: ProductVariant[]
}

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
  const router = useRouter()
  const { addItem, isAdding } = useCart()
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>(
    {}
  )
  const [quantity, setQuantity] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["store-product-details", product.id],
    queryFn: ({ signal }) =>
      baseApi.get<ProductDetails>(`/store/products/${product.id}`, { signal }),
    enabled: open,
    staleTime: 0,
    refetchOnMount: true,
  })

  const selectedVariant = useMemo(() => {
    if (!data?.options.length) return null
    if (Object.keys(selectedValues).length !== data.options.length) return null

    return (
      data.variants.find((variant) =>
        data.options.every((option) =>
          variant.options.some(
            (variantOption) =>
              variantOption.optionId === option.id &&
              variantOption.id === selectedValues[option.id]
          )
        )
      ) ?? null
    )
  }, [data, selectedValues])

  const hasOptions = Boolean(data?.options.length)
  const canAdd = !hasOptions || Boolean(selectedVariant)
  const availableStock = hasOptions
    ? (selectedVariant?.stock ?? 0)
    : product.stock
  const currentPrice = data ? Number(data.sellingPrice) : sellingPrice
  const currentImage = data?.images[0]?.imageUrl ?? image ?? null
  const variantUnavailable =
    hasOptions && canAdd && !selectedVariant?.isAvailable

  const hasAvailableVariant = (optionId: string, valueId: string) => {
    const nextSelection = { ...selectedValues, [optionId]: valueId }

    return Boolean(
      data?.variants.some(
        (variant) =>
          variant.isAvailable &&
          variant.stock > 0 &&
          data.options.every((option) => {
            const selectedValue = nextSelection[option.id]
            return (
              !selectedValue ||
              variant.options.some(
                (variantOption) =>
                  variantOption.optionId === option.id &&
                  variantOption.id === selectedValue
              )
            )
          })
      )
    )
  }

  const handleAddToCart = async () => {
    if (!canAdd || !data || availableStock < 1 || quantity > availableStock)
      return

    try {
      const addedQuantity = await addItem({
        productId: product.id,
        variantId: selectedVariant?.id ?? null,
        quantity,
        stock: availableStock,
        name: product.name,
        price: currentPrice,
        imageUrl: currentImage,
      })

      onOpenChange(false)
      if (buyNow) router.push("/checkout")
      else if (addedQuantity < quantity) {
        toast.success(`Added ${addedQuantity} item(s). Maximum available stock reached.`)
      } else {
        toast.success("Added to cart")
      }
    } catch (error) {
      const responseMessage =
        typeof error === "object" && error !== null && "data" in error
          ? (error as { data?: { message?: unknown } }).data?.message
          : undefined
      const serverMessage = Array.isArray(responseMessage)
        ? responseMessage.join(" ")
        : typeof responseMessage === "string"
          ? responseMessage
          : ""

      const stockMatch = serverMessage.match(
        /Only (\d+) item\(s\) are currently available/i
      )

      if (stockMatch) {
        const available = Number(stockMatch[1])
        toast.error(
          available > 0
            ? `দুঃখিত, বর্তমানে এই পণ্যটি মাত্র ${available}টি স্টকে আছে। পরিমাণ কমিয়ে আবার চেষ্টা করুন।`
            : "দুঃখিত, এই পণ্যটি বর্তমানে স্টকে নেই।"
        )
      } else {
        toast.error(
          buyNow
            ? "চেকআউটে যাওয়া যায়নি। আবার চেষ্টা করুন।"
            : "কার্টে পণ্যটি যোগ করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।"
        )
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

            {data.options.length > 0 ? (
              <div className="space-y-4">
                {data.options.map((option) => {
                  const isColor = option.type === "COLOR"
                  const selectedValue = selectedValues[option.id]

                  return (
                    <div key={option.id} className="space-y-2">
                      <Label className="text-xs font-semibold uppercase">
                        {option.name}:{" "}
                        <span className="font-normal text-primary">
                          {option.values.find(
                            (value) => value.id === selectedValue
                          )?.label ?? `Select ${option.name.toLowerCase()}`}
                        </span>
                      </Label>

                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                          const active = selectedValue === value.id
                          const available = hasAvailableVariant(
                            option.id,
                            value.id
                          )

                          return (
                            <Button
                              key={value.id}
                              type="button"
                              variant={
                                isColor
                                  ? "outline"
                                  : active
                                    ? "default"
                                    : "outline"
                              }
                              size={isColor ? "icon" : "sm"}
                              onClick={() =>
                                setSelectedValues((current) => ({
                                  ...current,
                                  [option.id]: value.id,
                                }))
                              }
                              aria-pressed={active}
                              aria-label={
                                isColor
                                  ? `Select color ${value.label}`
                                  : undefined
                              }
                              title={value.label}
                              className={
                                isColor
                                  ? `relative hover:border-primary! ${active ? "border-2! p-0.5 border-primary!" : ""} ${!available ? "opacity-50" : ""}`
                                  : `relative min-w-8 overflow-hidden ${!available ? "opacity-50" : ""}`
                              }
                            >
                              {isColor ? (
                                <span
                                  aria-hidden="true"
                                  className="block w-full h-full border border-border/50"
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
                {Object.keys(selectedValues).length === data.options.length &&
                  !selectedVariant && (
                    <p className="text-xs text-destructive">
                      This combination is not available.
                    </p>
                  )}
                {selectedVariant && !selectedVariant.isAvailable && (
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

            <div className="flex items-center justify-between">
              <Label htmlFor={`quantity-${product.id}`}>Quantity</Label>
              <div className="flex items-center border border-border">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                >
                  <Minus className="size-3.5" />
                </Button>
                <span
                  id={`quantity-${product.id}`}
                  className="min-w-8 text-center text-sm tabular-nums"
                >
                  {quantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Increase quantity"
                  disabled={quantity >= availableStock}
                  onClick={() =>
                    setQuantity((value) => Math.min(availableStock, value + 1))
                  }
                >
                  <Plus className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={
              isLoading ||
              isError ||
              !data ||
              !canAdd ||
              variantUnavailable ||
              availableStock < 1 ||
              quantity > availableStock ||
              isAdding
            }
            onClick={() => void handleAddToCart()}
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
