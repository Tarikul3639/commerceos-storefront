"use client"

import Image from "next/image"
import Link from "next/link"
import { ImageIcon, ShoppingCart } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/features/cart/hooks/use-cart"

export interface ProductCardData {
  id: string
  name: string
  sellingPrice: string | number
  originalPrice?: string | number | null
  discountPercentage?: string | number | null
  images: string[]
}

interface ProductCardProps {
  product: ProductCardData
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const image = product.images[0]
  const { addItem, isAdding } = useCart()
  const hasDiscount =
    product.originalPrice !== null &&
    product.originalPrice !== undefined &&
    Number(product.originalPrice) > Number(product.sellingPrice)

  const handleAddToCart = async () => {
    try {
      await addItem({
        productId: product.id,
        variantId: null,
        quantity: 1,
        name: product.name,
        price: Number(product.sellingPrice),
        imageUrl: image ?? null,
      })
      toast.success("Added to cart")
    } catch {
      toast.error("Could not add this product to cart")
    }
  }

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden border border-border/70 bg-card transition-shadow duration-300 hover:shadow-md">
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
        aria-label={`View ${product.name}`}
      >
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground">
            <ImageIcon className="size-8 opacity-50" />
          </div>
        )}


        {hasDiscount && (
          <Badge
            className="absolute top-2 right-2 rounded-xs bg-red-500 text-white"
          >
            {Number(product.discountPercentage).toFixed(0)}% OFF
          </Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link
          href={`/products/${product.id}`}
          className="line-clamp-2 text-sm leading-5 font-medium text-foreground transition-colors hover:text-primary"
        >
          {product.name}
        </Link>
        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <p className="text-sm font-semibold text-foreground">
            ৳{Number(product.sellingPrice).toLocaleString("en-BD")}
          </p>
          {hasDiscount && (
            <p className="text-xs text-muted-foreground line-through">
              ৳{Number(product.originalPrice).toLocaleString("en-BD")}
            </p>
          )}
        </div>
        <Button
          type="button"
          size="sm"
          className="mt-1 w-full"
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          <ShoppingCart className="size-4" />
          {isAdding ? "Adding..." : "Add to Cart"}
        </Button>
      </div>
    </article>
  )
}
