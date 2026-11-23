"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCart } from "@/features/cart/hooks/use-cart"
import type { ProductCardData } from "@/features/product/types/product.types"
import { isNewArrival } from "@/features/product/utils/product.utils"
import { getInitials } from "@/lib/utils"

interface ProductCardProps {
  product: ProductCardData
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addItem, isAdding } = useCart()

  console.log("ProductCard rendered for product:", product)

  const image = product.images[0] ?? null
  const isOutOfStock = product.stock <= 0

  const sellingPrice = Number(product.sellingPrice)
  const originalPrice = Number(product.originalPrice)

  const hasDiscount =
    product.originalPrice !== null &&
    product.originalPrice !== undefined &&
    originalPrice > sellingPrice

  const isNew = isNewArrival(product.createdAt)

  const handleAddToCart = async () => {
    if (isOutOfStock || isAdding) return

    try {
      await addItem({
        productId: product.id,
        variantId: null,
        quantity: 1,
        stock: product.stock,
        name: product.name,
        price: sellingPrice,
        imageUrl: image,
      })

      toast.success("Added to cart")
    } catch {
      toast.error("Could not add this product to cart")
    }
  }

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden border border-border/70 bg-card transition-shadow duration-300 hover:shadow-md">
      {/* Product image and promotional badges */}
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label={`View ${product.name}`}
      >
        <Avatar className="size-full rounded-none after:hidden">
          {image && (
            <AvatarImage
              src={image}
              alt={product.name}
              className="rounded-none object-cover transition-transform duration-500 group-hover:scale-105"
              fetchPriority={priority ? "high" : "auto"}
            />
          )}

          <AvatarFallback className="rounded-none bg-muted text-2xl font-semibold tracking-wider text-muted-foreground">
            {getInitials(product.name) || "P"}
          </AvatarFallback>
        </Avatar>

        {/* Discount badge */}
        {hasDiscount && (
          <Badge className="absolute top-2 right-2 rounded-xs bg-red-500 text-white">
            {Number(product.discountPercentage).toFixed(0)}% OFF
          </Badge>
        )}

        {/* Stock status takes priority over New Arrival */}
        {isOutOfStock ? (
          <Badge
            variant="secondary"
            className="absolute top-2 left-2 rounded-xs"
          >
            Out of Stock
          </Badge>
        ) : (
          isNew && (
            <Badge className="absolute top-2 left-2 rounded-xs bg-green-500 text-white">
              New Arrival
            </Badge>
          )
        )}
      </Link>

      {/* Product information and cart action */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link
          href={`/products/${product.id}`}
          className="line-clamp-2 text-sm leading-5 font-medium text-foreground transition-colors hover:text-primary"
        >
          {product.name}
        </Link>

        {/* Product pricing */}
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="text-sm font-semibold text-foreground">
            ৳{sellingPrice.toLocaleString("en-BD")}
          </p>

          {hasDiscount && (
            <p className="text-xs text-muted-foreground line-through">
              ৳{originalPrice.toLocaleString("en-BD")}
            </p>
          )}
        </div>

        {/* Add to cart */}
        <Button
          type="button"
          size="sm"
          className="mt-1 w-full"
          variant={isOutOfStock ? "secondary" : "default"}
          disabled={isAdding || isOutOfStock}
          onClick={handleAddToCart}
        >
          {!isOutOfStock && <ShoppingCart className="size-4" />}

          {isOutOfStock
            ? "Out of Stock"
            : isAdding
              ? "Adding..."
              : "Add to Cart"}
        </Button>
      </div>
    </article>
  )
}