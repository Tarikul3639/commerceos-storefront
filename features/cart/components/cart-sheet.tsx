"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

/**
 * Presents the shopping cart in a right-side drawer so shoppers can review it without leaving the current page.
 * Cart data and actions will be connected to the backend-owned cart in the cart integration task.
 */
export function CartSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          aria-label="Open shopping cart"
          className="size-9 shrink-0 text-foreground/80 hover:bg-muted hover:text-foreground md:h-11 md:w-auto md:flex-col md:gap-0.5 md:px-3 md:text-[11px] md:font-medium"
        >
          <ShoppingBag className="size-5" />
          <span className="hidden md:inline">Cart</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[min(26rem,92vw)]">
        <SheetHeader className="border-b border-border pr-12">
          <SheetTitle>Your cart</SheetTitle>
          <SheetDescription>
            Review the items you plan to purchase.
          </SheetDescription>
        </SheetHeader>

        {/* This neutral empty state is temporary until cart API data is integrated. */}
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
      </SheetContent>
    </Sheet>
  )
}
