"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { useCart } from "@/features/cart/hooks/use-cart"

export function CartSheet() {
  const { items, totalItems, subtotal, removeItem, updateQuantity } = useCart()

  const handleRemove = async (item: (typeof items)[number]) => {
    try {
      await removeItem(item)
    } catch {
      toast.error("Could not remove this item")
    }
  }

  const handleQuantity = async (
    item: (typeof items)[number],
    quantity: number
  ) => {
    try {
      await updateQuantity(item, quantity)
    } catch {
      toast.error("Could not update quantity")
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          aria-label={`Open shopping cart, ${totalItems} items`}
          className="relative size-9 shrink-0 text-foreground/80 hover:bg-muted hover:text-primary md:h-11 md:w-auto md:flex-col md:gap-0.5 md:px-3 md:text-[11px] md:font-medium"
        >
          <ShoppingBag className="size-5" />
          <span className="hidden md:inline">Cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-none font-semibold text-primary-foreground">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right">
        <SheetHeader className="border-b border-border pr-12">
          <SheetTitle>Your cart ({totalItems})</SheetTitle>
          <SheetDescription>
            Review the items you plan to purchase.
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex size-14 items-center justify-center bg-muted">
              <ShoppingBag className="size-6 text-muted-foreground" />
            </span>
            <h3 className="text-base font-semibold">Your cart is empty</h3>
            <p className="max-w-xs text-sm text-muted-foreground">
              Add products to your cart and they will appear here.
            </p>
            <Button asChild className="mt-2">
              <Link href="/products">Continue shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto py-4">
              {items.map((item) => (
                <div
                  key={item.key}
                  className="flex gap-3 border-b border-border px-2 pb-4 sm:px-4"
                >
                  <div className="relative size-20 shrink-0 bg-muted">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="rounded object-cover"
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center">
                        <ShoppingBag className="size-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${item.productId}`}
                      className="line-clamp-2 text-sm font-medium transition-colors hover:text-primary hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm font-semibold">
                      ৳{item.price.toLocaleString("en-BD")}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon-xs"
                        aria-label="Decrease quantity"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          void handleQuantity(item, item.quantity - 1)
                        }
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span className="min-w-5 text-center text-sm tabular-nums">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon-xs"
                        aria-label="Increase quantity"
                        disabled={item.quantity >= item.stock}
                        onClick={() =>
                          void handleQuantity(item, item.quantity + 1)
                        }
                      >
                        <Plus className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        aria-label={`Remove ${item.name}`}
                        className="ml-auto text-destructive"
                        onClick={() => void handleRemove(item)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <SheetFooter className="gap-3 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">
                  ৳{subtotal.toLocaleString("en-BD")}
                </span>
              </div>
              <Button asChild className="w-full">
                <Link href="/cart">View Cart & Checkout</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
