import type { Metadata } from "next"

import { CategoryDetailsPage } from "@/features/categories/components/category-details-page"
import { getStoreCategoryBySlug } from "@/features/categories/api/category.api"

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getStoreCategoryBySlug(slug)

  if (!category) return { title: "Category not found" }

  return {
    title: category.name,
    description:
      category.description ??
      `Explore products in the ${category.name} category.`,
    openGraph: category.image ? { images: [category.image] } : undefined,
  }
}

export default function Page({ params, searchParams }: PageProps) {
  return <CategoryDetailsPage params={params} searchParams={searchParams} />
}
