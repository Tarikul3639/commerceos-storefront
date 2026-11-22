export type BannerPlacement =
  | "HOME_TOP"
  | "HOME_MIDDLE"
  | "HOME_BOTTOM"
  | "CATEGORY_TOP"
  | "CATEGORY_MIDDLE"
  | "PRODUCT_TOP"
  | "PRODUCT_MIDDLE"
  | "SHOP_TOP"
  | "SHOP_MIDDLE"
  | "SIDEBAR"

/** Public banner fields returned for one storefront placement. */
export type BannerSlideData = {
  id: string
  imageUrl: string
  mobileImageUrl: string | null
  position: BannerPlacement
  link: string | null
  openInNewTab: boolean
  sortOrder: number
}

/** A position groups its ordered banner slides for storefront rendering. */
export type BannerPositionData = {
  position: BannerPlacement
  banners: BannerSlideData[]
}