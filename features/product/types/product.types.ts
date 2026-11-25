/**
 * Storefront product contracts aligned with the backend store product DTOs.
 * Keep product, option and variant shapes here so cards, dialogs, details and
 * cart features consume one source of truth.
 */

export type ProductOptionType =
  "COLOR" | "SIZE" | "STORAGE" | "CAPACITY" | "CUSTOM"

export interface ProductRelation {
  id: string
  name: string
}

export interface ProductImage {
  id: string
  imageUrl: string
  publicId: string
  sortOrder: number
}

export interface ProductOptionValue {
  id: string
  label: string
  colorCode: string | null
}

export interface ProductOption {
  id: string
  name: string
  type: ProductOptionType
  values: ProductOptionValue[]
}

export interface ProductVariantOption {
  id: string
  label: string
  colorCode: string | null
  optionId: string
  optionName: string
  optionType: ProductOptionType
}

/** Variant data shared by product details and cart responses. */
export interface ProductVariantBase {
  id: string
  sku: string
  stock: number
  options: ProductVariantOption[]
}

/** Variant shape returned by GET /store/products/:productId. */
export interface StoreProductVariant extends ProductVariantBase {
  isAvailable: boolean
}

/** Variant metadata returned by the backend cart response. */
export interface CartVariantDetails extends ProductVariantBase {
  colorName?: string | null
  colorHex?: string | null
  size?: string | null
}

/** Response contract for GET /store/products/:productId. */
export interface StoreProductDetailResponse {
  id: string
  name: string
  subDescription: string | null
  description: string | null
  sellingPrice: string
  originalPrice: string | null
  discountPercentage: string | null
  category: ProductRelation
  brand: ProductRelation | null
  sizeGuide: Record<string, unknown> | null
  images: ProductImage[]
  options: ProductOption[]
  variants: StoreProductVariant[]
  createdAt: string
  updatedAt: string
}

/** Fields used by product cards and the store product listing endpoint. */
export interface ProductCardData {
  id: string
  name: string
  sellingPrice: string | number
  originalPrice?: string | number | null
  discountPercentage?: string | number | null
  stock: number
  images: string[]
  createdAt?: string
}

export interface StoreProduct extends ProductCardData {
  subDescription: string | null
  categoryId: string
  brandId: string | null
  createdAt: string
}

export interface StoreProductsResponse {
  data: StoreProduct[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type ProductSelection = Record<string, string>
export interface ProductSizeGuide {
  id: string
  name: string
  description: string | null
  unit: string
  columns: string[]
  rows: Record<string, string | number>[]
}
