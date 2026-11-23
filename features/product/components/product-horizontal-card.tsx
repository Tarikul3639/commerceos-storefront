"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Flame, ShoppingCart } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCart } from "@/features/cart/hooks/use-cart"
import type { ProductCardData } from "@/features/product/types/product.types"
import { getInitials } from "@/lib/utils"

interface ProductHorizontalCardProps {
  product: ProductCardData
  badgeLabel?: string
  priority?: boolean
}

/**
 * A horizontal product presentation for featured or promoted placements.
 * Kept separate from ProductCard so existing product grids remain unchanged.
 */
export function ProductHorizontalCard({
  product,
  badgeLabel = "Best Selling",
  priority = false,
}: ProductHorizontalCardProps) {
  const router = useRouter()
  const { addItem, isAdding } = useCart()

  const image = product.images[0] ?? null
  const isOutOfStock = product.stock <= 0
  const sellingPrice = Number(product.sellingPrice)
  const originalPrice = Number(product.originalPrice)

  const hasDiscount =
    product.originalPrice !== null &&
    product.originalPrice !== undefined &&
    Number.isFinite(originalPrice) &&
    originalPrice > sellingPrice

  const savings = hasDiscount ? originalPrice - sellingPrice : 0

  const addProductToCart = async () => {
    if (isOutOfStock || isAdding) return

    await addItem({
      productId: product.id,
      variantId: null,
      quantity: 1,
      stock: product.stock,
      name: product.name,
      price: sellingPrice,
      imageUrl: image,
    })
  }

  const handleAddToCart = async () => {
    try {
      await addProductToCart()
      toast.success("Added to cart")
    } catch {
      toast.error("Could not add this product to cart")
    }
  }

  const handleBuyNow = async () => {
    try {
      await addProductToCart()
      router.push("/checkout")
    } catch {
      toast.error("Could not proceed. Please try again.")
    }
  }

  return (
    <article className="relative flex min-h-64 flex-col overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md sm:min-h-72 sm:flex-row">
      {badgeLabel && (
        <Badge className="absolute top-0 right-0 z-10 gap-1 rounded-bl-md rounded-tr-md rounded-tl-none rounded-br-none bg-red-500 px-2.5 py-1 text-xs text-white hover:bg-red-500">
          <Flame className="size-3.5" />
          {badgeLabel}
        </Badge>
      )}

      <Link
        href={`/products/${product.id}`}
        aria-label={`View ${product.name}`}
        className="group relative block min-h-56 w-full shrink-0 bg-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none sm:min-h-72 sm:w-[38%]"
      >
        <Avatar className="size-full rounded-none after:hidden">
          {image && (
            <AvatarImage
              src={image}
              alt={product.name}
              className="rounded-none object-contain p-4 transition-transform duration-500 group-hover:scale-105 sm:p-6"
              fetchPriority={priority ? "high" : "auto"}
            />
          )}
          <AvatarFallback className="rounded-none bg-muted text-2xl font-semibold text-muted-foreground">
            {getInitials(product.name) || "P"}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 px-5 py-5 sm:px-7 sm:py-8">
        <Link
          href={`/products/${product.id}`}
          className="line-clamp-2 pr-16 text-lg font-semibold text-foreground transition-colors hover:text-primary sm:text-xl"
        >
          {product.name}
        </Link>

        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <p className="text-lg font-bold text-orange-500 sm:text-xl">
            ৳{sellingPrice.toLocaleString("en-BD")}
          </p>
          {hasDiscount && (
            <p className="text-sm text-muted-foreground line-through">
              ৳{originalPrice.toLocaleString("en-BD")}
            </p>
          )}
        </div>

        {hasDiscount && (
          <Badge className="w-fit rounded-full bg-lime-400 px-3 py-1 text-xs font-medium text-foreground hover:bg-lime-400">
            Save ৳{savings.toLocaleString("en-BD")}
          </Badge>
        )}

        <div className="mt-2 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10 border-orange-500 px-4 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
            disabled={isAdding || isOutOfStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart />
            {isOutOfStock ? "Out of Stock" : isAdding ? "Adding..." : "Add To Cart"}
          </Button>
          <Button
            type="button"
            className="h-10 bg-orange-500 px-4 text-white hover:bg-orange-600"
            disabled={isAdding || isOutOfStock}
            onClick={handleBuyNow}
          >
            <ShoppingCart />
            Buy now
          </Button>
        </div>
      </div>
    </article>
  )
}
