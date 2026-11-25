export interface StoreProductSearchResult {
  id: string
  name: string
  subDescription: string | null
  sellingPrice: string
  originalPrice: string | null
  discountPercentage: string | null
  stock: number
  images: string[]
  categoryName: string
  brandName: string | null
}

export interface StoreProductSearchResponse {
  data: StoreProductSearchResult[]
  total: number
}
