"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { CartItem as CartItemType } from "@/features/cart/types/cart-item"

interface CartItemProps {
  item: CartItemType
  variant?: "sheet" | "page"
  onRemove: (item: CartItemType) => void
  onQuantityChange: (item: CartItemType, quantity: number) => void
}

export function CartItem({
  item,
  variant = "page",
  onRemove,
  onQuantityChange,
}: CartItemProps) {
  const isSheet = variant === "sheet"
  const productHref =
    "/products/" +
    item.productId +
    (item.variant?.sku ? "?sku=" + encodeURIComponent(item.variant.sku) : "")

  return (
    <article
      className={
        isSheet
          ? "flex gap-3 border-b border-border px-2 pb-4 sm:px-4"
          : "flex gap-4 border-b border-border pb-4"
      }
    >
      <Link
        href={productHref}
        aria-label={"View " + item.name + " details"}
        className={
          "relative shrink-0 bg-muted " +
          (isSheet ? "size-20" : "size-24 sm:size-28")
        }
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes={isSheet ? "80px" : "112px"}
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <ShoppingBag
              className={
                isSheet
                  ? "size-5 text-muted-foreground"
                  : "size-6 text-muted-foreground"
              }
            />
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          href={productHref}
          className={
            "line-clamp-2 font-medium transition-colors hover:text-primary hover:underline " +
            (isSheet ? "text-sm" : "")
          }
        >
          {item.name}
        </Link>
        {item.variant?.options.length ? (
          <p className="mt-1 text-xs text-muted-foreground">
            {item.variant.options.map((option) => option.label).join(" / ")}
          </p>
        ) : null}
        <p className="mt-1 text-sm font-semibold">
          ৳{item.price.toLocaleString("en-BD")}
        </p>

        {item.quantity > item.stock && (
          <p className="mt-1 text-xs font-medium text-destructive">
            Only {item.stock} item(s) currently available.
          </p>
        )}

        <div
          className={
            isSheet
              ? "mt-2 flex items-center gap-2"
              : "mt-3 flex items-center gap-2"
          }
        >
          <div className="flex w-20 items-center justify-between bg-accent">
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Decrease quantity"
              disabled={item.quantity <= 1}
              className="hover:text-primary"
              onClick={() => onQuantityChange(item, item.quantity - 1)}
            >
              <Minus className="size-3" />
            </Button>
            <span className="min-w-5 text-center text-sm tabular-nums">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="Increase quantity"
              disabled={item.quantity >= item.stock}
              className="hover:text-primary"
              onClick={() => onQuantityChange(item, item.quantity + 1)}
            >
              <Plus className="size-3" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size={"xs"}
            aria-label={"Remove " + item.name}
            className="bg-transparent! text-accent-foreground/60 underline underline-offset-2"
            onClick={() => onRemove(item)}
          >
            Remove
          </Button>
        </div>
      </div>

      {!isSheet && (
        <p className="hidden shrink-0 text-sm font-semibold sm:block">
          ৳{(item.price * item.quantity).toLocaleString("en-BD")}
        </p>
      )}
    </article>
  )
}
