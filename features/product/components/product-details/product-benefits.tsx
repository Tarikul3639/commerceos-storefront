"use client"

import { BadgeCheck, Clock3, ShieldCheck } from "lucide-react"

const benefits = [
  {
    icon: BadgeCheck,
    title: "100% original",
    description: "Authentic products, carefully selected.",
  },
  {
    icon: Clock3,
    title: "10 days replacement",
    description: "Replacement support for eligible products.",
  },
  {
    icon: ShieldCheck,
    title: "Year warranty",
    description: "Warranty coverage as specified for the product.",
  },
]

export function ProductBenefits() {
  return (
    <div className="grid grid-cols-1 gap-8 border-y py-8 sm:grid-cols-3 sm:gap-6">
      {benefits.map(({ icon: Icon, title, description }) => (
        <div key={title} className="flex flex-col items-center text-center">
          <Icon className="mb-4 size-5 text-primary" />
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      ))}
    </div>
  )
}
