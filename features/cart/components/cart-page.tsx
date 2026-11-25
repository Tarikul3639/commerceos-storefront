"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useCart } from "@/features/cart/hooks/use-cart"
import { CartItem } from "./cart-item"

export function CartPage() {
  const { items, subtotal, totalItems, removeItem, updateQuantity } = useCart()

  const update = async (action: () => Promise<void>) => {
    try {
      await action()
    } catch {
      toast.error("Could not update your cart. Please try again.")
    }
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm text-muted-foreground">Shopping</p>
        <h1 className="text-3xl font-semibold tracking-tight">Your Cart</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalItems} items in your cart
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center gap-3 border border-border px-6 text-center">
          <ShoppingBag className="size-10 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Your cart is empty</h2>
          <p className="text-sm text-muted-foreground">
            Explore our products and find something you love.
          </p>
          <Button asChild className="mt-2">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <section className="space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.key}
                item={item}
                onRemove={(cartItem) => void update(() => removeItem(cartItem))}
                onQuantityChange={(cartItem, quantity) =>
                  void update(() => updateQuantity(cartItem, quantity))
                }
              />
            ))}
          </section>

          <aside className="h-fit border border-border p-5">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="mt-5 flex justify-between text-sm">
              <span className="text-muted-foreground">
                Subtotal ({totalItems} items)
              </span>
              <span className="font-semibold">
                ৳{subtotal.toLocaleString("en-BD")}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Shipping and applicable taxes are calculated at checkout.
            </p>
            <Button asChild className="mt-6 w-full">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
            <Button asChild variant="outline" className="mt-2 w-full">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </aside>
        </div>
      )}
    </main>
  )
}
