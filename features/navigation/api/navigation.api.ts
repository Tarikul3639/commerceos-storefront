import { serverApi } from "@/lib/api/server-api"

export type NavigationCategory = {
  id: string
  name: string
  slug: string
  description: string | null
}

type NavigationCategoriesResponse = {
  data: NavigationCategory[]
}

/**
 * Fetches the small category list used by the shared storefront navigation.
 * The response is cached by Next.js and revalidated every five minutes.
 */
export async function getNavigationCategories(): Promise<NavigationCategory[]> {
  const response = await serverApi.get<NavigationCategoriesResponse>(
    "/categories/navigation",
    {
      revalidate: 300,
      tags: ["navigation-categories", "categories"],
    }
  )

  return response.data
}
