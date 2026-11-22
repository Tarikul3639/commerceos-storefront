import type { Metadata } from "next"

import { CategoriesPage } from "@/features/categories/components/categories-page"

export const metadata: Metadata = {
  title: "Explore Categories",
  description: "A curated index of collections. Find the pieces that fit your world.",
}

type PageProps = {
  searchParams: Promise<{ page?: string }>
}

export default function Page({ searchParams }: PageProps) {
  return <CategoriesPage searchParams={searchParams} />
}
