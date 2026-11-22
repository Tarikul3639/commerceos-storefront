import { AnnouncementMessage } from "@/features/announcement/components/announcement-message"
import { serverApi } from "@/lib/api/server-api"

interface StorefrontAnnouncement {
  message: string
}

/**
 * Displays the active store-wide announcement above the main header.
 * The content is fetched on the server so it is never exposed as a client-side API dependency.
 */
export async function StoreAnnouncement() {
  let announcement: StorefrontAnnouncement | null = null

  try {
    announcement = await serverApi.get<StorefrontAnnouncement | null>(
      "/settings/announcement/storefront",
      { cache: "no-store" }
    )
  } catch {
    // Keep the public storefront available if the settings endpoint is temporarily unavailable.
    return null
  }

  if (!announcement?.message?.trim()) {
    return null
  }

  return (
    <div className="bg-foreground text-background">
      <div className="mx-auto flex h-9 max-w-7xl items-center gap-2 px-4 text-xs font-medium sm:px-6 lg:px-8">
        <AnnouncementMessage message={announcement.message} />
      </div>
    </div>
  )
}
