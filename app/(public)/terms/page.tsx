import type { Metadata } from "next"
import { ContentPage, ContentSection } from "@/components/layout/content-page"
import { storeConfig } from "@/config/store.config"

export const metadata: Metadata = {
  title: "Terms & Conditions | " + storeConfig.name,
  description: "Read the terms that apply when using the " + storeConfig.name + " online store.",
}

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Please read before shopping"
      title="Terms & conditions"
      description={"These terms describe the general conditions for browsing and using the " + storeConfig.name + " storefront. Please use the site responsibly and review the information that applies to your order."}
    >
      <div className="mx-auto max-w-3xl">
        <p className="mb-6 text-xs text-muted-foreground">Last updated: 26 November 2026</p>
        <ContentSection title="1. Using this website">
          <p>You may use this website for lawful, personal shopping and information purposes. You agree not to misuse the site, interfere with its operation, attempt unauthorized access, or submit information that is misleading or unlawful.</p>
        </ContentSection>
        <ContentSection title="2. Product information and availability">
          <p>Product descriptions, images, prices, and availability are presented to help you make a purchase decision. We make reasonable efforts to keep listings accurate, but display errors or changes may occur. Product availability is not guaranteed until an order is accepted.</p>
        </ContentSection>
        <ContentSection title="3. Orders and confirmation">
          <p>Submitting an order is a request to purchase the selected items. An order is subject to review and confirmation by the store. If an item is unavailable or an order cannot be fulfilled, the store should contact you using the details provided with the order.</p>
        </ContentSection>
        <ContentSection title="4. Pricing and payment">
          <p>The price and any applicable charges shown during checkout are the amounts presented for your order at that time. Available payment methods and payment instructions are shown during checkout. Do not send payment details through public messages or unofficial channels.</p>
        </ContentSection>
        <ContentSection title="5. Delivery, cancellation, and returns">
          <p>Delivery options, estimated timelines, cancellation eligibility, and return or exchange conditions should be reviewed in the information provided by the store before completing your order. If those details are not shown for an item or order, contact us before purchasing.</p>
        </ContentSection>
        <ContentSection title="6. Accounts and customer information">
          <p>If account features are enabled, you are responsible for keeping your sign-in credentials confidential and for activity carried out through your account. Please notify the store if you believe your account has been accessed without permission.</p>
          <p>Information submitted during browsing, checkout, or support requests should be accurate and up to date.</p>
        </ContentSection>
        <ContentSection title="7. Website content">
          <p>Unless otherwise stated, the storefront&apos;s text, branding, design, and other original content are provided for use on this website and may not be copied, republished, or commercially reused without permission from the relevant rights holder.</p>
        </ContentSection>
        <ContentSection title="8. Changes to these terms">
          <p>These terms may be updated when the store or its services change. The latest version will be published on this page.</p>
        </ContentSection>
        <ContentSection title="9. Contact">
          <p>If you have a question about these terms, contact <a className="font-medium text-foreground underline underline-offset-4" href={"mailto:" + storeConfig.contact.email}>{storeConfig.contact.email}</a>.</p>
        </ContentSection>
      </div>
    </ContentPage>
  )
}
