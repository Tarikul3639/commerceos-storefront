import type { Metadata } from "next"

import { HomePage } from "@/features/home/components/home-page"

export const metadata: Metadata = {
  title: "Home | Your Store",
  description:
    "Explore a thoughtful collection of products and discover something for your everyday life.",
  openGraph: {
    title: "Home | Your Store",
    description:
      "Explore a thoughtful collection of products and discover something for your everyday life.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home | Your Store",
    description:
      "Explore a thoughtful collection of products and discover something for your everyday life.",
  },
}

export default function Page() {
  return <HomePage />
}
