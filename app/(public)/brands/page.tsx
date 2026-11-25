import type { Metadata } from "next"

import { BrandsPage } from "@/features/brands/components/brands-page"

export const metadata: Metadata = {
  title: "Brands",
  description:
    "Explore the brands behind our collection and discover your favorites.",
}

type BrandsRouteProps = {
  searchParams: Promise<{ page?: string; search?: string }>
}

export default function BrandsRoute({ searchParams }: BrandsRouteProps) {
  return <BrandsPage searchParams={searchParams} />
}
