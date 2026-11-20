"use client"

import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const menuLinks = [
  { href: "/products", label: "Shop all products" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
  { href: "/about", label: "About us" },
]

/**
 * Mobile navigation drawer for secondary storefront destinations.
 */
export function HeaderMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          aria-label="Open navigation menu"
          className="shrink-0"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[min(20rem,85vw)]">
        <SheetHeader className="border-b border-border">
          <SheetTitle>Explore the store</SheetTitle>
        </SheetHeader>

        <nav
          aria-label="Mobile sidebar navigation"
          className="flex flex-col p-3"
        >
          {menuLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
