"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowRight, CircleHelp, Mail, Search } from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ContentPage } from "@/components/layout/content-page"
import { storeConfig } from "@/config/store.config"

const faqGroups = [
  {
    title: "Orders",
    questions: [
      {
        question: "How do I place an order?",
        answer: "Browse the products, open the item you want, choose any available options, and add it to your cart. Review your cart and continue to checkout to submit your order.",
      },
      {
        question: "How can I check my order status?",
        answer: "Sign in to your account and open the orders section to review your order history and available status updates. If you checked out without an account or need help, contact the store and include your order number.",
      },
      {
        question: "Can I change or cancel an order?",
        answer: "Contact the store as soon as possible with your order number and the change you need. Changes may not be possible once an order has been processed or dispatched.",
      },
    ],
  },
  {
    title: "Payments",
    questions: [
      {
        question: "What payment methods are available?",
        answer: "The payment options available to you are shown during checkout. Choose one of the methods displayed there and follow the checkout instructions.",
      },
      {
        question: "Is it safe to make a payment?",
        answer: "Complete payments only through the checkout options presented on this website. Never share your password, PIN, or one-time verification code with anyone claiming to provide support.",
      },
    ],
  },
  {
    title: "Products & Returns",
    questions: [
      {
        question: "How do I ask about a product?",
        answer: "Open the product page and note its name. Send your question through the contact page or the store email so the team can identify the item you're asking about.",
      },
      {
        question: "What if I want to return or exchange an item?",
        answer: "Return and exchange eligibility depends on the store's policy and the item. Review the Terms & Conditions page, then contact the store with your order number and the reason for your request.",
      },
      {
        question: "An item is unavailable. Will it be restocked?",
        answer: "Product availability can change. Contact the store with the product name or link to ask whether more stock is expected.",
      },
    ],
  },
  {
    title: "Account & Support",
    questions: [
      {
        question: "I can't sign in. What should I do?",
        answer: "Check that you're using the email address associated with your account. If password reset is available, use the reset option on the sign-in page. Otherwise, contact the store for assistance.",
      },
      {
        question: "How can I contact customer support?",
        answer: "Visit the Contact Us page to find the available support email, phone number, and store information. For order-related questions, include your order number.",
      },
    ],
  },
]

export function FAQPageContent() {
  const [search, setSearch] = useState("")
  const normalizedSearch = search.trim().toLowerCase()

  const filteredGroups = useMemo(
    () =>
      faqGroups
        .map((group) => ({
          ...group,
          questions: group.questions.filter(
            (item) =>
              item.question.toLowerCase().includes(normalizedSearch) ||
              item.answer.toLowerCase().includes(normalizedSearch),
          ),
        }))
        .filter((group) => group.questions.length > 0),
    [normalizedSearch],
  )

  const totalResults = filteredGroups.reduce(
    (total, group) => total + group.questions.length,
    0,
  )

  return (
    <ContentPage
      eyebrow="Help center"
      title="Frequently asked questions"
      description={`Find quick answers about shopping at ${storeConfig.name}, orders, payments, products, and your account.`}
    >
      <div className="mx-auto max-w-3xl">
        <div className="relative mb-8">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search questions..."
            aria-label="Search frequently asked questions"
            className="h-11 rounded-sm pl-9"
          />
          {search && (
            <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">
              {totalResults} {totalResults === 1 ? "result" : "results"} found
            </p>
          )}
        </div>

        {filteredGroups.length > 0 ? (
          <div className="space-y-8">
            {filteredGroups.map((group, groupIndex) => (
              <section key={group.title}>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-foreground">
                    {group.title}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {group.questions.length} {group.questions.length === 1 ? "question" : "questions"}
                  </span>
                </div>
                <div className="rounded-sm border border-border px-4 sm:px-6">
                  <Accordion type="single" collapsible className="w-full">
                    {group.questions.map((item, index) => (
                      <AccordionItem
                        key={item.question}
                        value={`faq-${groupIndex}-${index}`}
                      >
                        <AccordionTrigger className="gap-4 py-4 text-left text-sm font-medium hover:no-underline hover:text-primary">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 text-sm leading-7 text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="rounded-sm border border-dashed border-border px-6 py-12 text-center">
            <CircleHelp className="mx-auto size-8 text-muted-foreground" />
            <h2 className="mt-3 text-base font-semibold">No matching questions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Try another search term or contact our support team.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4 rounded-sm"
              onClick={() => setSearch("")}
            >
              Clear search
            </Button>
          </div>
        )}

        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-sm border border-border bg-muted/30 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-background text-foreground">
              <Mail className="size-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold">Still need help?</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Our team can help with questions that are not covered here.
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="w-full rounded-sm sm:w-auto">
            <Link href="/contact">
              Contact support <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </ContentPage>
  )
}