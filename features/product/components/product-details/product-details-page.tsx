"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useCart } from "@/features/cart/hooks/use-cart"
import type {
  StoreProductDetailResponse,
  StoreProductVariant,
} from "@/features/product/types"
import { baseApi } from "@/lib/api/base-api"
import { getApiErrorMessage } from "@/lib/api/api-error"
import { cn } from "@/lib/utils"

type Selection = Record<string, string>

interface ProductDetailsPageProps {
  productId: string
  initialVariantId: string | null
}

function matchesSelection(variant: StoreProductVariant, selection: Selection) {
  return Object.entries(selection).every(([optionId, valueId]) =>
    variant.options.some(
      (option) => option.optionId === optionId && option.id === valueId
    )
  )
}

export function ProductDetailsPage({
  productId,
  initialVariantId,
}: ProductDetailsPageProps) {
  const router = useRouter()
  const { addItem, isAdding, items: cartItems } = useCart()
  const [userSelection, setUserSelection] = useState<Selection | null>(null)
  const [quantity, setQuantity] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["store-product-details", productId],
    queryFn: ({ signal }) =>
      baseApi.get<StoreProductDetailResponse>(`/store/products/${productId}`, { signal }),
    staleTime: 60_000,
  })

  const defaultSelection = useMemo<Selection>(() => {
    if (!data?.variants.length) return {}

    const requestedVariant = initialVariantId
      ? data.variants.find((variant) => variant.id === initialVariantId)
      : undefined

    const variant =
      requestedVariant ??
      data.variants.find((item) => item.isAvailable && item.stock > 0) ??
      data.variants[0]

    return Object.fromEntries(
      variant?.options.map((option) => [option.optionId, option.id]) ?? []
    )
  }, [data, initialVariantId])

  const selection = userSelection ?? defaultSelection
  const hasOptions = Boolean(data?.options.length)

  const selectedVariant = useMemo(() => {
    if (!data?.options.length) return null
    if (Object.keys(selection).length !== data.options.length) return null

    return (
      data.variants.find((variant) => matchesSelection(variant, selection)) ??
      null
    )
  }, [data, selection])

  const isVariantOutOfStock = Boolean(
    selectedVariant && (!selectedVariant.isAvailable || selectedVariant.stock < 1)
  )
  const canAdd = !hasOptions || Boolean(selectedVariant)

  const availableStock = hasOptions
    ? (selectedVariant?.stock ?? 0)
    : (data?.variants.reduce((total, variant) => total + variant.stock, 0) ?? 0)

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

  const currentImage = data?.images[0]?.imageUrl
  const currentPrice = Number(data?.sellingPrice ?? 0)
  const originalPrice = data?.originalPrice
    ? Number(data.originalPrice)
    : null

  const handleAddToCart = async () => {
    if (!data || !canAdd || isVariantOutOfStock || remainingStock < 1) {
      toast.error(
        remainingStock < 1
          ? "This selected variant is currently out of stock."
          : "Please select an available product option."
      )
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
        price: currentPrice,
        imageUrl: currentImage ?? null,
      })

      toast.success(
        addedQuantity < safeQuantity
          ? `Added ${addedQuantity} item(s). Maximum available stock reached.`
          : "Added to cart"
      )
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to add product to cart."))
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid animate-pulse gap-8 md:grid-cols-2">
          <div className="aspect-square bg-muted" />
          <div className="space-y-4">
            <div className="h-5 w-1/3 bg-muted" />
            <div className="h-8 w-3/4 bg-muted" />
            <div className="h-6 w-1/2 bg-muted" />
            <div className="h-24 bg-muted" />
          </div>
        </div>
      </main>
    )
  }

  if (isError || !data) {
    return (
      <main className="mx-auto flex min-h-[40vh] max-w-7xl flex-col items-center justify-center gap-3 px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">
          Could not load this product. It may be unavailable or removed.
        </p>
        <Button asChild variant="outline">
          <Link href="/products">Back to products</Link>
        </Button>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to products
      </Link>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden bg-muted">
            {currentImage ? (
              <Image
                src={currentImage}
                alt={data.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                No image available
              </div>
            )}
            {data.discountPercentage && (
              <Badge className="absolute top-3 left-3">
                {data.discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {data.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {data.images.slice(0, 5).map((productImage) => (
                <div
                  key={productImage.id}
                  className="relative aspect-square overflow-hidden border border-border bg-muted"
                >
                  <Image
                    src={productImage.imageUrl}
                    alt={data.name}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            {data.category.name}
            {data.brand ? ` · ${data.brand.name}` : ""}
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {data.name}
          </h1>
          {data.subDescription && (
            <p className="mt-2 text-sm text-muted-foreground">
              {data.subDescription}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <p className="text-2xl font-semibold text-primary">
              ৳{currentPrice.toLocaleString("en-BD")}
            </p>
            {originalPrice !== null && originalPrice > currentPrice && (
              <p className="text-base text-muted-foreground line-through">
                ৳{originalPrice.toLocaleString("en-BD")}
              </p>
            )}
          </div>

          {hasOptions ? (
            <div className="mt-8 space-y-6">
              {data.options.map((option) => {
                const isColor = option.type === "COLOR"
                const selectedValueId = selection[option.id]

                return (
                  <div key={option.id} className="space-y-3">
                    <Label className="text-xs font-semibold uppercase">
                      {option.name}:{" "}
                      <span className="font-normal text-primary">
                        {option.values.find(
                          (value) => value.id === selectedValueId
                        )?.label ?? "Select an option"}
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
                            aria-pressed={active}
                            aria-label={
                              isColor
                                ? `Select color ${value.label}`
                                : undefined
                            }
                            title={value.label}
                            disabled={!available}
                            onClick={() => {
                              const nextSelection = {
                                ...selection,
                                [option.id]: value.id,
                              }
                              setUserSelection(nextSelection)

                              const nextVariant =
                                Object.keys(nextSelection).length ===
                                data.options.length
                                  ? data.variants.find((variant) =>
                                      matchesSelection(variant, nextSelection)
                                    )
                                  : undefined

                              if (nextVariant) {
                                router.replace(
                                  `/products/${productId}?variant=${encodeURIComponent(nextVariant.id)}`,
                                  { scroll: false }
                                )
                              }
                            }}
                            className={cn(
                              "relative",
                              isColor
                                ? [
                                    "hover:border-primary!",
                                    active && "border-2! border-primary! p-0.5",
                                  ]
                                : "min-w-10",
                              !available && "opacity-40"
                            )}
                          >
                            {isColor ? (
                              <span
                                aria-hidden="true"
                                className="block size-full border border-border/50"
                                style={{
                                  backgroundColor:
                                    value.colorCode ?? "transparent",
                                }}
                              />
                            ) : (
                              value.label
                            )}
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {selectedVariant && (
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>SKU: {selectedVariant.sku}</p>
                  <p>
                    {selectedVariant.stock > 0
                      ? `${selectedVariant.stock} available`
                      : "Out of stock"}
                  </p>
                </div>
              )}
              {!selectedVariant && (
                <p className="text-sm text-destructive">
                  This combination is not available.
                </p>
              )}
            </div>
          ) : (
            <p className="mt-6 text-sm text-muted-foreground">
              {availableStock > 0
                ? `${availableStock} items available`
                : "Out of stock"}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="flex h-10 items-center border border-border">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Decrease quantity"
                disabled={safeQuantity <= 1}
                onClick={() => setQuantity(safeQuantity - 1)}
              >
                <Minus className="size-4" />
              </Button>
              <span className="min-w-10 text-center text-sm tabular-nums">
                {safeQuantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Increase quantity"
                disabled={safeQuantity >= remainingStock}
                onClick={() => setQuantity(safeQuantity + 1)}
              >
                <Plus className="size-4" />
              </Button>
            </div>

            <Button
              type="button"
              className="min-w-48 flex-1 sm:flex-none"
              disabled={
                isAdding ||
                !canAdd ||
                isVariantOutOfStock ||
                remainingStock < 1
              }
              onClick={() => void handleAddToCart()}
            >
              <ShoppingCart className="size-4" />
              {isAdding ? "Adding..." : "Add to cart"}
            </Button>
          </div>

          {quantityInCart > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              {quantityInCart} of this variant already in your cart.{" "}
              {remainingStock} more available.
            </p>
          )}

          {data.description && (
            <section className="mt-10 border-t border-border pt-6">
              <h2 className="text-base font-semibold">Product Description</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted-foreground">
                {data.description}
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  )
}
