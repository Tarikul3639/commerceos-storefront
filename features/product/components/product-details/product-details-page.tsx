"use client"

import Link from "next/link"
import { Minus, Plus, ShoppingCart, Heart, Share2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProductImageGallery } from "./product-image-gallery"
import { ProductOptions } from "./product-options"
import { ProductBenefits } from "./product-benefits"
import { ProductDescription } from "./product-description"
import { useProductDetails } from "@/features/product/hooks/use-product-details"
import { useProductPurchase } from "@/features/product/hooks/use-product-purchase"
import { useProductWishlist } from "@/features/wishlist/hooks/use-product-wishlist"

interface ProductDetailsPageProps {
  productId: string
  initialSku: string | null
}

export function ProductDetailsPage({
  productId,
  initialSku,
}: ProductDetailsPageProps) {
  const {
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
  } = useProductDetails({ productId, initialSku })

  const {
    quantity,
    setQuantity,
    remainingStock,
    safeQuantity,
    isAdding,
    handleAddToCart,
  } = useProductPurchase({
    productId,
    data,
    selectedVariant,
    availableStock,
    isOutOfStock,
  })

  const { isFavorite, isUpdatingFavorite, toggleFavorite } =
    useProductWishlist(productId)

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: data?.name ?? "Product", url })
      } else {
        await navigator.clipboard.writeText(url)
        toast.success("Product link copied")
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Could not share this product")
      }
    }
  }

  const originalPrice = data?.originalPrice ? Number(data.originalPrice) : null
  const currentPrice = Number(data?.sellingPrice ?? 0)

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid animate-pulse gap-8 md:grid-cols-2">
          <div className="aspect-square rounded-xl bg-muted" />
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
      <main className="mx-auto flex min-h-[40vh] max-w-6xl flex-col items-center justify-center gap-3 px-4 py-16 text-center">
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
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid min-w-0 gap-8 md:grid-cols-2">
        <div className="min-w-0 md:flex md:justify-center">
          <div className="w-full md:max-w-lg">
            <ProductImageGallery name={data.name} images={data.images} />
          </div>
        </div>

        <div className="flex min-w-0 flex-col justify-center gap-4">
          <div className="flex flex-col gap-2">
            {hasOptions && totalStock > 0 ? (
              <span className="text-xs font-medium text-green-600 uppercase dark:text-green-500">
                In Stock: {totalStock}
              </span>
            ) : hasOptions ? (
              <span className="text-xs font-medium text-destructive uppercase">
                Out of Stock
              </span>
            ) : (
              <span className="text-xs font-medium text-muted-foreground uppercase">
                No variant inventory
              </span>
            )}

            <h1 className="text-lg font-semibold tracking-tight">
              {data.name}
            </h1>
            {data.category && (
              <p className="text-xs text-muted-foreground">
                {data.category.name}
                {data.brand ? ` · ${data.brand.name}` : ""}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <p className="text-2xl font-semibold tracking-tight">
                ৳
                {currentPrice.toLocaleString("en-BD", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              {originalPrice !== null && originalPrice > currentPrice && (
                <>
                  <p className="text-sm text-muted-foreground line-through">
                    ৳
                    {originalPrice.toLocaleString("en-BD", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  {data.discountPercentage && (
                    <Badge variant="destructive">
                      {data.discountPercentage}% OFF
                    </Badge>
                  )}
                </>
              )}
            </div>
            {data.subDescription && (
              <p className="text-sm text-muted-foreground">
                {data.subDescription}
              </p>
            )}
          </div>

          <Separator />

          {hasOptions && data ? (
            <ProductOptions
              data={data}
              selection={selection}
              sizeGuide={sizeGuide}
              onSelect={handleProductSelection}
            />
          ) : null}

          {selectedVariant && (
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                SKU:{" "}
                <span className="font-medium text-foreground">
                  {selectedVariant.sku}
                </span>
              </p>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-2">
              <Label className="text-xs uppercase">Quantity</Label>
              <div className="flex w-fit items-center rounded-sm border">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  aria-label="Decrease quantity"
                  className="flex size-8 items-center justify-center text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Minus className="size-4" />
                </button>
                <span className="flex h-8 min-w-9 items-center justify-center border-x text-sm font-medium">
                  {isOutOfStock ? 0 : Math.min(safeQuantity, availableStock)}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) => Math.min(remainingStock, value + 1))
                  }
                  disabled={isOutOfStock || safeQuantity >= remainingStock}
                  aria-label="Increase quantity"
                  className="flex size-8 items-center justify-center text-sm transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center">
              {isOutOfStock ? (
                <span className="text-xs font-medium text-destructive">
                  Out of stock
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  <span className="text-emerald-600 dark:text-emerald-500">
                    In stock
                  </span>
                  {" · "}
                  {availableStock} left
                </span>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              size="lg"
              variant="outline"
              disabled={isAdding || isOutOfStock || remainingStock < 1}
              onClick={() => void handleAddToCart()}
              className="gap-2"
            >
              <ShoppingCart className="size-4" />
              {isAdding ? "Adding..." : "Add to cart"}
            </Button>
            <Button
              type="button"
              size="lg"
              disabled={isAdding || isOutOfStock || remainingStock < 1}
              onClick={() => void handleAddToCart(true)}
              className="gap-2"
            >
              Buy now
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6">
            <button
              type="button"
              onClick={toggleFavorite}
              disabled={isUpdatingFavorite}
              aria-pressed={isFavorite}
              className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
            >
              <Heart
                className={`size-3 ${isFavorite ? "fill-current text-destructive" : ""}`}
              />
              {isFavorite ? "Favorited" : "Favorite"}
            </button>
            <button
              type="button"
              onClick={() => void handleShare()}
              className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <Share2 className="size-3" />
              Share
            </button>
          </div>
        </div>
      </div>

      <ProductBenefits />

      <ProductDescription
        description={data.description}
        brandName={data.brand?.name ?? "Undefined"}
        categoryName={data.category?.name}
        createdAt={data.createdAt}
      />
    </main>
  )
}
