import {
  Info,
  Package,
  Search,
  Store,
  Tag,
  UserRound,
} from "lucide-react"

export const navigationItems = [
  { href: "/products", label: "Shop all", icon: Store },
  { href: "/brands", label: "Brands", icon: Tag },
  { href: "/about", label: "Our story", icon: Info },
]

export const featuredCategories = [
  { href: "/categories/new-arrivals", label: "New arrivals", badge: "New" },
  { href: "/categories/best-sellers", label: "Best sellers" },
  { href: "/categories/home", label: "Home" },
  { href: "/categories/beauty", label: "Beauty" },
  { href: "/categories/fashion", label: "Fashion" },
  { href: "/categories/electronics", label: "Electronics" },
  { href: "/categories/sale", label: "Sale", badge: "Sale" },
  { href: "/categories/gifts", label: "Gifts" },
]

export const accountLinks = [
  { href: "/account", label: "My account", icon: UserRound },
  { href: "/account/orders", label: "Orders", icon: Package },
]

export const popularSearches = [
  "Gift sets",
  "Wireless earbuds",
  "Summer dresses",
  "Home decor",
]

export const searchIcon = Search
