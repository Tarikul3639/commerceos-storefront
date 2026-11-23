import type { ProductCardData } from "@/features/product/types/product.types"

export interface ProductCardProps {
  product: ProductCardData
  priority?: boolean
  isHorizontal?: boolean
  badgeLabel?: string
}

export interface ProductCardImageProps {
  product: ProductCardData
  priority?: boolean
  isHorizontal?: boolean
  isOutOfStock: boolean
  hasDiscount: boolean
}

export interface ProductCardActionsProps {
  product: ProductCardData
  image: string | undefined
  sellingPrice: number
  isOutOfStock: boolean
  isHorizontal: boolean
}
