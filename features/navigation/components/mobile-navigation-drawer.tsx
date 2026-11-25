"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Heart,
  LayoutGrid,
  Menu,
  UserRound,
  type LucideIcon,
} from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { storeConfig } from "@/config/store.config"
import { SearchTrigger } from "@/features/search/components/search-trigger"
import type { NavigationCategory } from "@/features/navigation/api/navigation.api"
import { cn } from "@/lib/utils"

type NavigationItem = {
  href: string
  label: string
  icon: LucideIcon
}

const navigationItems: NavigationItem[] = [
  { href: "/products", label: "Shop all", icon: LayoutGrid },
  { href: "/brands", label: "Brands", icon: Heart },
  { href: "/about", label: "Our story", icon: UserRound },
]

export function MobileNavigationDrawer({
  onOpenSearch,
  categories,
}: {
  onOpenSearch: () => void
  categories: NavigationCategory[]
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const featuredCategories = categories.slice(0, 8)
  const categoriesHref = "/categories"

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="-ml-2 text-foreground/80 hover:bg-muted hover:text-foreground md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-[min(22rem,88vw)] flex-col gap-0 p-0"
      >
        <SheetHeader className="px-5 py-5 pr-12 text-left">
          <SheetTitle>{storeConfig.name}</SheetTitle>
          <SheetDescription>Find what you need</SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="px-5 py-4">
          <SearchTrigger
            variant="drawer"
            onOpen={onOpenSearch}
            onBeforeOpen={() => setOpen(false)}
          />
        </div>
        <Separator />

        <ScrollArea className="min-h-0 flex-1">
          <nav aria-label="Mobile navigation" className="px-2 py-2">
            {navigationItems.map((item) => {
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors hover:bg-muted",
                    active && "bg-muted"
                  )}
                >
                  <item.icon
                    aria-hidden="true"
                    className="size-4 text-muted-foreground"
                  />
                  {item.label}
                </Link>
              )
            })}

            <Accordion type="single" collapsible>
              <AccordionItem value="categories" className="border-b-0">
                <AccordionTrigger className="rounded-md px-3 py-3 text-sm font-medium hover:bg-muted hover:no-underline">
                  <span className="flex items-center gap-3">
                    <LayoutGrid
                      aria-hidden="true"
                      className="size-4 text-muted-foreground"
                    />
                    Categories
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-1">
                  <div className="grid grid-cols-1 gap-0.5 pl-7">
                    {featuredCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        onClick={() => setOpen(false)}
                        aria-current={
                          isActive(`/categories/${category.slug}`)
                            ? "page"
                            : undefined
                        }
                        className={cn(
                          "flex items-center justify-between rounded-md px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-muted hover:text-foreground",
                          isActive(`/categories/${category.slug}`) &&
                            "bg-muted text-foreground"
                        )}
                      >
                        {category.name}
                        {category.slug === "new-arrivals" && (
                          <Badge variant="secondary">New</Badge>
                        )}
                        {category.slug === "sale" && (
                          <Badge variant="secondary">Sale</Badge>
                        )}
                      </Link>
                    ))}
                    <Link
                      href={categoriesHref}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(categoriesHref) ? "page" : undefined}
                      className={cn(
                        "rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                        isActive(categoriesHref) && "bg-muted"
                      )}
                    >
                      See all categories
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </nav>
        </ScrollArea>

        <Separator />

        <Link
          href="/account"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 rounded-sm bg-card p-3 transition-colors hover:bg-muted/60"
        >
          <Avatar size="lg">
            <AvatarFallback className="text-xs font-semibold">
              YN
            </AvatarFallback>
          </Avatar>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">
              Your name
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              your@email.com
            </span>
          </span>
        </Link>
      </SheetContent>
    </Sheet>
  )
}
