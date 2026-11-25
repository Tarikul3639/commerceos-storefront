"use client"

import Link from "next/link"
import { Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { WishlistItem } from "./wishlist-item"
import { useWishlistItems } from "../hooks/use-wishlist-items"

export function WishlistSheet() {
  const { items, isLoading, removeItem } = useWishlistItems()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Open wishlist"
          className="relative size-9 shrink-0 text-foreground/80 hover:bg-muted hover:text-primary md:h-11 md:w-auto md:flex-col md:gap-0.5 md:px-3 md:text-[11px] md:font-medium"
        >
          <Heart className="size-5" />
          <span className="hidden md:inline">Cart</span>
          {items.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground">
              {items.length > 9 ? "9+" : items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[min(92vw,440px)] sm:max-w-md">
        <SheetHeader className="border-b pr-12">
          <SheetTitle>My Wishlist ({items.length})</SheetTitle>
          <SheetDescription>
            Your saved products, all in one place.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="size-5 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-56 flex-col items-center justify-center gap-2 text-center">
              <Heart className="size-8 text-muted-foreground" />
              <p className="text-sm font-medium">Your wishlist is empty</p>
              <p className="text-xs text-muted-foreground">
                Add products to save them for later.
              </p>
            </div>
          ) : (
            items
              .slice(0, 5)
              .map((item) => (
                <WishlistItem
                  key={item.id}
                  item={item}
                  onRemove={removeItem}
                  compact
                />
              ))
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t p-4">
            <SheetClose asChild>
              <Button asChild className="w-full">
                <Link href="/wishlist">View wishlist</Link>
              </Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
