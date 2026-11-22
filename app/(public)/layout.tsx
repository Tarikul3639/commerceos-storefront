import type { ReactNode } from "react"

import { Footer } from "@/components/layout/footer"
import { StoreAnnouncement } from "@/features/announcement/components/store-announcement"
import { StoreHeader } from "@/components/layout/store-header"

/**
 * Wraps public storefront pages with the store announcement, shared masthead and footer.
 */
export default function PublicLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex min-h-svh flex-col">
      <StoreAnnouncement />
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
