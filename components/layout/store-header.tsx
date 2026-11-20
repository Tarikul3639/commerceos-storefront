"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Package, UserRound } from "lucide-react"

import { DesktopNavigation } from "@/components/layout/desktop-navigation"
import { MobileNavigationDrawer } from "@/components/layout/mobile-navigation-drawer"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CartSheet } from "@/features/cart/components/cart-sheet"
import {
  SearchDialog,
  SearchTrigger,
} from "@/features/search/components/search-dialog"
import { storeConfig } from "@/config/store.config"
import { cn } from "@/lib/utils"

const accountLinks = [
  { href: "/account", label: "My account", icon: UserRound },
  { href: "/account/orders", label: "Orders", icon: Package },
]
const wishlistLink = { href: "/wishlist", label: "Wishlist" }

/**
 * Renders the complete storefront header, including the sticky masthead and desktop navigation.
 * Search state and keyboard shortcuts stay here so every search trigger shares one dialog.
 */
export function StoreHeader() {
  const [searchOpen, setSearchOpen] = useState(false)

  // Support the conventional command shortcut and slash-to-search without hijacking text entry.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable

      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setSearchOpen((current) => !current)
      } else if (
        event.key === "/" &&
        !typing &&
        !event.metaKey &&
        !event.ctrlKey
      ) {
        event.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 md:h-20 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-8">
            <div className="flex items-center md:hidden">
              <MobileNavigationDrawer
                onOpenSearch={() => setSearchOpen(true)}
              />
            </div>

            <Link
              href="/"
              aria-label={`${storeConfig.name} home`}
              className="flex min-w-0 items-center justify-self-center md:justify-self-start"
            >
              {storeConfig.logo ? (
                <Image
                  src={storeConfig.logo}
                  alt={storeConfig.name}
                  width={144}
                  height={40}
                  className="h-8 w-auto max-w-32 object-contain md:h-9 md:max-w-36"
                  priority
                />
              ) : (
                <span className="truncate text-lg font-semibold tracking-tight text-foreground md:text-xl">
                  {storeConfig.name}
                </span>
              )}
            </Link>

            <div className="hidden w-full md:block md:max-w-2xl md:justify-self-center">
              <SearchTrigger
                variant="desktop"
                onOpen={() => setSearchOpen(true)}
              />
            </div>

            <div className="flex items-center gap-0.5 justify-self-end md:gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className={cn(
                      "size-9 shrink-0 text-foreground/80 hover:bg-muted hover:text-foreground md:h-11 md:w-auto md:flex-col md:gap-0.5 md:px-3 md:text-[11px] md:font-medium"
                    )}
                    aria-label="Account menu"
                  >
                    <UserRound className="size-5" />
                    <span>Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2">
                  <DropdownMenuLabel className="flex items-center gap-3 px-2 py-3 font-normal">
                    <Avatar size="lg" className="size-11">
                      <AvatarFallback className="text-xs font-semibold">
                        YN
                      </AvatarFallback>
                    </Avatar>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-foreground">
                        Your name
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        your@email.com
                      </span>
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {accountLinks.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href}>
                        <item.icon />
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                asChild
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "size-9 shrink-0 text-foreground/80 hover:bg-muted hover:text-foreground md:h-11 md:w-auto md:flex-col md:gap-0.5 md:px-3 md:text-[11px] md:font-medium"
                )}
              >
                <Link href={wishlistLink.href} aria-label={wishlistLink.label}>
                  <Heart className="size-5" />
                  <span className="hidden md:inline">{wishlistLink.label}</span>
                </Link>
              </Button>

              {/* CartSheet owns the cart drawer interaction and contents. */}
              <CartSheet />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <DesktopNavigation />
      </div>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
