"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { HeartOff, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductVariantDialog } from "@/features/product/components/product-card/product-variant-dialog"
import type { WishlistItem as WishlistItemType } from "../hooks/use-wishlist-items"

interface WishlistItemProps {
  item: WishlistItemType
  onRemove: (id: string) => void
  compact?: boolean
}

export function WishlistItem({
  item,
  onRemove,
  compact = false,
}: WishlistItemProps) {
  const [variantDialogOpen, setVariantDialogOpen] = useState(false)

  return (
    <>
      <article
        className={`flex min-w-0 gap-3 border-b py-4 last:border-b-0 ${compact ? "items-center" : "items-start sm:gap-5"}`}
      >
        <Link
          href={`/products/${item.id}`}
          className={`relative shrink-0 overflow-hidden bg-muted ${compact ? "size-20" : "size-24 sm:size-28"}`}
        >
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-xs text-muted-foreground">
              No image
            </span>
          )}
        </Link>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Link
            href={`/products/${item.id}`}
            className="line-clamp-2 text-sm font-medium hover:text-primary"
          >
            {item.name}
          </Link>
          <p className="text-sm font-semibold text-primary">
            ৳{item.price.toLocaleString("en-BD")}
          </p>

          {!item.isAvailable && (
            <p className="text-xs text-destructive">Currently unavailable</p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="xs"
              disabled={!item.isAvailable}
              onClick={() => setVariantDialogOpen(true)}
              className="gap-1.5"
            >
              <ShoppingCart className="size-3.5" />
              Add to cart
            </Button>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => onRemove(item.id)}
              className="gap-1 text-muted-foreground"
            >
              <HeartOff className="size-3.5" /> Remove
            </Button>
          </div>
        </div>
      </article>

      <ProductVariantDialog
        open={variantDialogOpen}
        onOpenChange={setVariantDialogOpen}
        product={{ id: item.id, name: item.name, stock: 0 }}
        image={item.imageUrl}
        sellingPrice={item.price}
      />
    </>
  )
}
