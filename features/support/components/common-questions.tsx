"use client"

import Link from "next/link"
import { ArrowRight, CircleHelp } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

const questions = [
  {
    question: "How do I place an order?",
    answer:
      "Browse the products, open the item you want, choose any available options, and add it to your cart. Review your cart and continue to checkout to submit your order.",
  },
  {
    question: "How can I check my order status?",
    answer:
      "Sign in to your account and check the orders area if order history is available. If you checked out without an account or need help, contact the store and include your order number.",
  },
  {
    question: "Can I change or cancel an order?",
    answer:
      "Contact the store as soon as possible with your order number and the change you need. Changes may not be possible once an order has been processed or dispatched.",
  },
  {
    question: "What payment methods are available?",
    answer:
      "The payment options available to you are shown during checkout. Choose one of the methods displayed there and follow the checkout instructions.",
  },
  {
    question: "How do I ask about a product?",
    answer:
      "Open the product page and note its name. Send your question through the contact page or the store email so the team can identify the item you're asking about.",
  },
  {
    question: "What if I want to return or exchange an item?",
    answer:
      "Return and exchange eligibility depends on the store's policy and the item. Review the Terms & Conditions page, then contact the store with your order number and the reason for your request.",
  },
  {
    question: "I can't sign in. What should I do?",
    answer:
      "Check that you're using the email address associated with your account. If password reset is available, use the reset option on the sign-in page. Otherwise, contact the store for assistance.",
  },
]

interface CommonQuestionsProps {
  compact?: boolean
}

export function CommonQuestions({ compact = false }: CommonQuestionsProps) {
  return (
    <section className={compact ? "mt-10" : "mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"}>
      <div className={compact ? "mb-5" : "mx-auto mb-8 max-w-2xl text-center"}>
        <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          <CircleHelp className="size-4" />
          Help center
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Common questions
        </h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Quick answers to common questions about shopping, orders, payments, and support.
        </p>
      </div>

      <div className="mx-auto max-w-3xl rounded-sm border border-border px-4 sm:px-6">
        <Accordion type="single" collapsible className="w-full">
          {questions.map((item, index) => (
            <AccordionItem key={item.question} value={`question-${index + 1}`}>
              <AccordionTrigger className="gap-4 py-4 text-sm font-medium hover:no-underline hover:text-primary">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-sm leading-7 text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {!compact && (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <p className="text-sm text-muted-foreground">Still need help?</p>
          <Button asChild variant="outline" size="sm" className="rounded-sm">
            <Link href="/contact">
              Contact support <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  )
}
