import type { ReactNode } from "react"

import { Footer } from "@/components/layout/footer"
import { StoreAnnouncement } from "@/features/announcement/components/store-announcement"
import { StoreHeader } from "@/components/layout/store-header"
import { StoreBreadcrumbs } from "@/components/layout/store-breadcrumbs"
import { getNavigationCategories } from "@/features/navigation/api/navigation.api"

/**
 * Wraps public storefront pages with the store announcement, shared masthead and footer.
 */
export default async function PublicLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const navigationCategories = await getNavigationCategories()

  return (
    <div className="flex min-h-svh flex-col">
      <StoreAnnouncement />
      <StoreHeader navigationCategories={navigationCategories} />
      <StoreBreadcrumbs />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
