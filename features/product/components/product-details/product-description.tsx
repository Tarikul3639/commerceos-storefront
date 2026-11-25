"use client"

import DOMPurify from "dompurify"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProductDescriptionProps {
  description: string | null
  brandName: string | null
  categoryName: string | null
  createdAt: string | Date | null
}

export function ProductDescription({
  description,
  brandName,
  categoryName,
  createdAt,
}: ProductDescriptionProps) {
  const cleanDescription = description
    ? DOMPurify.sanitize(description, {
        USE_PROFILES: {
          html: true,
        },
      })
    : null

  const formattedCreatedAt = createdAt
    ? new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(createdAt))
    : "Not available"

  return (
    <Card className="min-w-0">
      <CardHeader className="border-b">
        <CardTitle className="text-lg">Product Description</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Description */}
        <div className="min-h-20 min-w-0">
          {cleanDescription ? (
            <div
              className="rich-text-content"
              dangerouslySetInnerHTML={{
                __html: cleanDescription,
              }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              No description available.
            </p>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Product Information</h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Brand Name */}
            <div className="space-y-1 rounded-sm border p-3">
              <p className="text-xs text-muted-foreground">Brand Name</p>
              <p className="text-sm font-medium">
                {brandName || "Not specified"}
              </p>
            </div>

            {/* Category */}
            <div className="space-y-1 rounded-sm border p-3">
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="text-sm font-medium">
                {categoryName || "Not specified"}
              </p>
            </div>

            {/* Created At */}
            <div className="space-y-1 rounded-sm border p-3 sm:col-span-2">
              <p className="text-xs text-muted-foreground">Created At</p>
              <p className="text-sm font-medium">{formattedCreatedAt}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
