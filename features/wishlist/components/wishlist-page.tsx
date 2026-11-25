"use client"

import Link from "next/link"
import { Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WishlistItem } from "./wishlist-item"
import { useWishlistItems } from "../hooks/use-wishlist-items"

export function WishlistPage() {
  const { items, isLoading, isError, removeItem, clear, isUpdating } =
    useWishlistItems()

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">My Wishlist</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} saved {items.length === 1 ? "item" : "items"}
          </p>
        </div>
        {items.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clear}
            disabled={isUpdating}
          >
            Clear wishlist
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex min-h-48 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      ) : isError ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Could not load your wishlist. Please try again.
        </div>
      ) : items.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center gap-3 border border-dashed px-4 text-center">
          <Heart className="size-9 text-muted-foreground" />
          <h2 className="text-base font-medium">Your wishlist is empty</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Save products you love and find them here whenever you need them.
          </p>
          <Button asChild>
            <Link href="/products">Explore products</Link>
          </Button>
        </div>
      ) : (
        <div className="divide-y-0 border-y">
          {items.map((item) => (
            <WishlistItem key={item.id} item={item} onRemove={removeItem} />
          ))}
        </div>
      )}
    </section>
  )
}
