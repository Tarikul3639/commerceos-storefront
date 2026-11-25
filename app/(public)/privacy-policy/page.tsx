import type { Metadata } from "next"
import { ContentPage, ContentSection } from "@/components/layout/content-page"
import { storeConfig } from "@/config/store.config"

export const metadata: Metadata = {
  title: "Privacy Policy | " + storeConfig.name,
  description: "Learn how " + storeConfig.name + " handles information when you browse or shop with us.",
}

export default function PrivacyPolicyPage() {
  return (
    <ContentPage
      eyebrow="Your information"
      title="Privacy policy"
      description={"Your privacy matters to " + storeConfig.name + ". This page explains what information may be handled when you browse the store, contact us, or place an order."}
    >
      <div className="mx-auto max-w-3xl">
        <p className="mb-6 text-xs text-muted-foreground">Last updated: 26 November 2026</p>
        <ContentSection title="1. Information we may collect">
          <p>Depending on how you use the store, information may include details you provide directly, such as your name, email address, phone number, delivery address, order details, and messages sent to our support team.</p>
          <p>Basic technical information, such as browser or device details and pages visited, may also be processed to keep the storefront working and help diagnose technical issues.</p>
        </ContentSection>
        <ContentSection title="2. How information is used">
          <p>Information may be used to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Process and manage orders and customer requests.</li>
            <li>Respond to questions and provide customer support.</li>
            <li>Maintain, protect, and improve the storefront.</li>
            <li>Meet applicable legal or record-keeping requirements.</li>
          </ul>
        </ContentSection>
        <ContentSection title="3. Sharing and service providers">
          <p>Information may be shared with service providers where necessary to operate the store, such as providers involved in hosting, order processing, payment handling, or delivery. Those providers should receive only the information needed for their relevant service.</p>
          <p>The specific providers used by this store depend on the services enabled at checkout and during operation.</p>
        </ContentSection>
        <ContentSection title="4. Cookies and browser storage">
          <p>The storefront may use cookies or browser storage for essential features, such as remembering shopping activity or keeping the site usable between visits. You can manage cookies through your browser settings; disabling them may affect some features.</p>
        </ContentSection>
        <ContentSection title="5. Data security and retention">
          <p>Reasonable measures should be used to protect information against unauthorized access, loss, or misuse. Information should be kept only for as long as it is needed for the purpose it was collected, including applicable operational and legal requirements.</p>
          <p>No method of online storage or transmission can be guaranteed to be completely secure.</p>
        </ContentSection>
        <ContentSection title="6. Your choices and requests">
          <p>You may contact us to ask about personal information associated with your interaction with the store, or to request a correction where appropriate. We may need to verify your identity before responding.</p>
        </ContentSection>
        <ContentSection title="7. Contact">
          <p>For privacy-related questions, contact {storeConfig.name} at <a className="font-medium text-foreground underline underline-offset-4" href={"mailto:" + storeConfig.contact.email}>{storeConfig.contact.email}</a>.</p>
        </ContentSection>
      </div>
    </ContentPage>
  )
}
