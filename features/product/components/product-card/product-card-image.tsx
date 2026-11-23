import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getInitials } from "@/lib/utils"
import { isNewArrival } from "@/features/product/utils/product.utils"
import type { ProductCardImageProps } from "./product-card.types"

export function ProductCardImage({
  product,
  priority = false,
  isHorizontal = false,
  isOutOfStock,
  hasDiscount,
}: ProductCardImageProps) {
  const [image, secondImage] = product.images
  const isNew = isNewArrival(product.createdAt)

  return (
    <Link
      href={`/products/${product.id}`}
      aria-label={`View ${product.name}`}
      className={`group/image relative block aspect-square w-full shrink-0 overflow-hidden bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
        isHorizontal ? "sm:w-[38%]" : ""
      }`}
    >
      <Avatar className="size-full rounded-none after:hidden">
        {image && (
          <AvatarImage
            src={image}
            alt={product.name}
            fetchPriority={priority ? "high" : "auto"}
            className={`absolute inset-0 size-full rounded-none object-cover transition-all duration-700 ease-in-out group-hover/image:scale-105 ${
              secondImage ? "group-hover/image:opacity-0" : ""
            }`}
          />
        )}
        <AvatarFallback className="rounded-none bg-muted text-2xl font-semibold text-muted-foreground">
          {getInitials(product.name) || "P"}
        </AvatarFallback>
      </Avatar>

      {secondImage && (
        <Avatar className="pointer-events-none absolute inset-0 size-full rounded-none opacity-0 transition-opacity duration-300 group-hover/image:opacity-100 after:hidden">
          <AvatarImage
            src={secondImage}
            alt={`${product.name} - alternate view`}
            className="absolute inset-0 size-full scale-100 rounded-none object-cover transition-transform duration-1200 ease-in-out group-hover/image:scale-[1.3]"
          />
        </Avatar>
      )}

      {hasDiscount && !isOutOfStock && (
        <Badge className="absolute bottom-2 left-2 rounded-xs bg-red-500 text-white sm:top-2 sm:bottom-auto">
          {Number(product.discountPercentage).toFixed(0)}% OFF
        </Badge>
      )}
      {isOutOfStock ? (
        <Badge variant="secondary" className="absolute top-2 left-2 rounded-xs">
          Out of Stock
        </Badge>
      ) : (
        isNew && (
          <Badge className="absolute right-2 bottom-2 rounded-xs bg-green-500 text-white sm:top-2 sm:bottom-auto">
            <span className="sm:hidden">New</span>
            <span className="hidden sm:inline">New Arrival</span>
          </Badge>
        )
      )}
    </Link>
  )
}
