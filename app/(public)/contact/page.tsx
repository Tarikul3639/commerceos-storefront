import type { Metadata } from "next"
import { Mail, MapPin, Phone } from "lucide-react"

import { ContentPage, ContentSection } from "@/components/layout/content-page"
import { CommonQuestions } from "@/features/support/components/common-questions"
import { storeConfig } from "@/config/store.config"

export const metadata: Metadata = {
  title: "Contact Us | " + storeConfig.name,
  description: "Get in touch with " + storeConfig.name + " for help with products, orders, or general questions.",
}

export default function ContactPage() {
  const contactItems = [
    { label: "Email", value: storeConfig.contact.email, href: "mailto:" + storeConfig.contact.email, icon: Mail, description: "For general questions and order support." },
    { label: "Phone", value: storeConfig.contact.phone, href: "tel:" + storeConfig.contact.phone, icon: Phone, description: "Call us using the number below." },
    { label: "Location", value: storeConfig.contact.address, href: null, icon: MapPin, description: "Store location and service area." },
  ].filter((item) => item.value?.trim())

  return (
    <ContentPage eyebrow="We're here to help" title="Contact us" description="Have a question about a product, your shopping bag, or an order? Get in touch using the contact details below.">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {contactItems.map(({ label, value, href, icon: Icon, description }) => {
            const content = (
              <>
                <span className="flex size-10 items-center justify-center rounded-sm bg-muted text-foreground"><Icon className="size-5" /></span>
                <span className="mt-5 block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
                <span className="mt-1 block break-words text-base font-medium text-foreground">{value}</span>
                <span className="mt-2 block text-sm leading-6 text-muted-foreground">{description}</span>
              </>
            )
            return (
              <article key={label} className="rounded-sm border border-border p-5">
                {href ? <a href={href} className="block rounded-sm outline-none transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-ring">{content}</a> : content}
              </article>
            )
          })}
        </div>
        <div className="mt-8 rounded-sm border border-border bg-muted/30 p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Customer support</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight">How can we help?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">Send us an email with your question. If you are asking about an existing order, include your order number so the team can identify it more easily.</p>
          <a href={"mailto:" + storeConfig.contact.email + "?subject=" + encodeURIComponent("Customer support")} className="mt-5 inline-flex h-10 items-center justify-center rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
            <Mail className="mr-2 size-4" />Email {storeConfig.name}
          </a>
        </div>
        <CommonQuestions compact />
        <div className="mt-10">
          <ContentSection title="Before you contact us">
            <p>For order questions, include the order number and the email or phone number used at checkout. Please do not include passwords, full payment card numbers, or other sensitive payment details in your message.</p>
          </ContentSection>
        </div>
      </div>
    </ContentPage>
  )
}
