import type { Metadata } from "next"

import { FAQPageContent } from "@/features/support/components/faq-page"
import { storeConfig } from "@/config/store.config"

export const metadata: Metadata = {
  title: "FAQs | " + storeConfig.name,
  description: "Find answers to common questions about orders, payments, products, returns, and your account.",
}

export default function FAQRoute() {
  return <FAQPageContent />
}
