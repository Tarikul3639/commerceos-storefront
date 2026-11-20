import { Truck } from "lucide-react"

const announcement = "Free delivery on orders over $50"

/**
 * Displays the store-wide announcement above the main header.
 * Keep this separate so public layouts can position it independently of sticky navigation.
 */
export function StoreAnnouncement() {
  return (
    <div className="bg-foreground text-background">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-2 px-4 text-xs font-medium sm:px-6 lg:px-8">
        <Truck aria-hidden="true" className="size-3.5 shrink-0" />
        <p className="truncate">{announcement}</p>
      </div>
    </div>
  )
}
