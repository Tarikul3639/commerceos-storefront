"use client"

import Link from "next/link"
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
import type { NavigationCategory } from "@/features/navigation/api/navigation.api"

const navigationItems = [
  { href: "/products", label: "Shop all" },
  { href: "/brands", label: "Brands" },
  { href: "/about", label: "Our story" },
]

export function DesktopNavigation({
  categories,
}: {
  categories: NavigationCategory[]
}) {
  const pathname = usePathname()
  const featuredCategories = categories.slice(0, 5)
  const categoriesHref = "/categories"

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  return (
    <div className="mx-auto hidden max-w-7xl px-4 sm:px-6 md:grid lg:px-8">
      <NavigationMenu
        aria-label="Main navigation"
        className="h-11 max-w-none justify-start"
      >
        <NavigationMenuList className="-ml-3">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-148 grid-cols-1 gap-1 p-2">
                {featuredCategories.map((category) => (
                  <li key={category.id}>
                    <NavigationMenuLink asChild>
                      <Link href={`/categories/${category.slug}`}>
                        <span className="flex items-center gap-2 text-sm font-medium">
                          {category.name}
                          {category.slug === "new-arrivals" && (
                            <Badge variant="secondary">New</Badge>
                          )}
                          {category.slug === "sale" && (
                            <Badge variant="secondary">Sale</Badge>
                          )}
                        </span>
                        {category.description && (
                          <span className="text-xs text-muted-foreground">
                            {category.description}
                          </span>
                        )}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
              <Separator />
              <div className="p-2">
                <NavigationMenuLink asChild>
                  <Link href={categoriesHref} className="text-sm font-medium">
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
