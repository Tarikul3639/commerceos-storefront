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
