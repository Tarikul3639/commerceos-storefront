export type StoreCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
}

export type StoreCategoriesResponse = {
  data: StoreCategory[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}
