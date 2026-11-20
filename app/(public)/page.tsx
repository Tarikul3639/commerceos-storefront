import type { Metadata } from "next"

import { storeConfig } from "@/config/store.config"
import { HomePage } from "@/features/home/components/home-page"

export const metadata: Metadata = {
  title: `Home | ${storeConfig.name}`,
  description: storeConfig.description,
  openGraph: {
    title: `Home | ${storeConfig.name}`,
    description: storeConfig.description,
    type: "website",
    ...(storeConfig.logo ? { images: [storeConfig.logo] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: `Home | ${storeConfig.name}`,
    description: storeConfig.description,
    ...(storeConfig.logo ? { images: [storeConfig.logo] } : {}),
  },
}

/**
 * Storefront home route with SEO metadata derived from the deployment's store configuration.
 */
export default function Page() {
  return <HomePage />
}
