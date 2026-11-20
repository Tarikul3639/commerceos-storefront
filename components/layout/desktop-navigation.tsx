"use client"

import Link from "next/link"
import { Info, Store, Tag, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Separator } from "@/components/ui/separator"

type NavigationItem = {
  href: string
  label: string
  icon: LucideIcon
}

/** Main desktop links; active state follows the current storefront route. */
const navigationItems: NavigationItem[] = [
  { href: "/products", label: "Shop all", icon: Store },
  { href: "/brands", label: "Brands", icon: Tag },
  { href: "/about", label: "Our story", icon: Info },
]

/** Temporary category shortcuts until category navigation is loaded from the API. */
const featuredCategories = [
  {
    href: "/categories/new-arrivals",
    label: "New arrivals",
    description: "Just landed this week",
    badge: "New",
  },
  {
    href: "/categories/best-sellers",
    label: "Best sellers",
    description: "What everyone is buying",
  },
  {
    href: "/categories/home",
    label: "Home",
    description: "Decor, kitchen and storage",
  },
  {
    href: "/categories/beauty",
    label: "Beauty",
    description: "Skin, hair and body",
  },
  {
    href: "/categories/fashion",
    label: "Fashion",
    description: "Clothing and accessories",
  },
  {
    href: "/categories/electronics",
    label: "Electronics",
    description: "Gadgets and accessories",
  },
  {
    href: "/categories/sale",
    label: "Sale",
    description: "Limited-time discounts",
    badge: "Sale",
  },
  {
    href: "/categories/gifts",
    label: "Gifts",
    description: "Ideas for every budget",
  },
]

/**
 * Renders only the desktop category menu and primary navigation links.
 * This component is intentionally independent from the main masthead controls.
 */
export function DesktopNavigation() {
  const pathname = usePathname()
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  return (
    <div className="hidden md:grid">
      <NavigationMenu
        aria-label="Main navigation"
        className="h-11 max-w-none justify-start"
      >
        <NavigationMenuList className="-ml-3">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-136 grid-cols-2 gap-1 p-2">
                {featuredCategories.map((category) => (
                  <li key={category.href}>
                    <NavigationMenuLink asChild>
                      <Link href={category.href}>
                        <span className="flex items-center gap-2 text-sm font-medium">
                          {category.label}
                          {category.badge && (
                            <Badge variant="secondary">{category.badge}</Badge>
                          )}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {category.description}
                        </span>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
              <Separator />
              <div className="p-2">
                <NavigationMenuLink asChild>
                  <Link href="/categories" className="text-sm font-medium">
                    See all categories
                  </Link>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          {navigationItems.map((item) => {
            const active = isActive(item.href)
            return (
              <NavigationMenuItem key={item.href}>
                <NavigationMenuLink
                  asChild
                  active={active}
                  className={navigationMenuTriggerStyle()}
                >
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
