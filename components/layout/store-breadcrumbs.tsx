"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const SEGMENT_LABELS: Record<string, string> = {
  about: "About Us",
  account: "My Account",
  addresses: "Addresses",
  brands: "Brands",
  cart: "Shopping Cart",
  categories: "Categories",
  checkout: "Checkout",
  contact: "Contact",
  "forgot-password": "Forgot Password",
  login: "Sign In",
  notifications: "Notifications",
  orders: "Orders",
  privacy: "Privacy Policy",
  "privacy-policy": "Privacy Policy",
  products: "Products",
  profile: "Profile",
  register: "Create Account",
  reset: "Reset Password",
  "reset-password": "Reset Password",
  returns: "Returns",
  search: "Search",
  settings: "Settings",
  terms: "Terms & Conditions",
  wishlist: "Wishlist",
  "verify-email": "Verify Email",
}

function formatSegment(segment: string) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function getSegmentLabel(segment: string, previousSegment?: string) {
  if (previousSegment === "products") return "Product Details"
  if (previousSegment === "orders") return "Order Details"
  if (previousSegment === "returns") return "Return Details"

  return SEGMENT_LABELS[segment] ?? formatSegment(segment)
}

export function StoreBreadcrumbs() {
  const pathname = usePathname()

  if (!pathname || pathname === "/") return null

  const segments = pathname.split("/").filter(Boolean)
  const items = segments.map((segment, index) => ({
    label: getSegmentLabel(segment, segments[index - 1]),
    href: `/${segments.slice(0, index + 1).join("/")}`,
  }))

  return (
    <div className="mx-auto w-full max-w-7xl px-2 pt-4 sm:px-4 lg:px-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {items.map((item, index) => (
            <Fragment key={item.href}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === items.length - 1 ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
