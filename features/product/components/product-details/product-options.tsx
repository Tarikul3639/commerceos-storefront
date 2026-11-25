"use client"

import { useState } from "react"
import { Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { StoreProductDetailResponse } from "@/features/product/types"
import type {
  ProductSelection,
  ProductSizeGuide,
} from "../../types/product.types"
import { hasAvailableProductVariant } from "../../utils/product-variant.utils"

export function ProductOptions({
  data,
  selection,
  sizeGuide,
  onSelect,
}: {
  data: StoreProductDetailResponse
  selection: ProductSelection
  sizeGuide: ProductSizeGuide | null
  onSelect: (selection: ProductSelection) => void
}) {
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  const selectedSize = data.options
    .find((option) => option.type === "SIZE")
    ?.values.find(
      (value) =>
        value.id ===
        selection[
          data.options.find((option) => option.type === "SIZE")?.id ?? ""
        ]
    )?.label

  return (
    <div className="flex flex-col gap-4">
      {data.options.map((option) => {
        const isColor = option.type === "COLOR"
        const isSize = option.type === "SIZE"
        const selectedValue = option.values.find(
          (value) => value.id === selection[option.id]
        )

        return (
          <div key={option.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase">
                {option.name}:{" "}
                <span className="font-normal text-primary">
                  {selectedValue?.label ??
                    `Select ${option.name.toLowerCase()}`}
                </span>
              </Label>

              {isSize && sizeGuide && (
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen((open) => !open)}
                  aria-expanded={sizeGuideOpen}
                  className="flex items-center gap-1 text-xs font-medium text-primary transition-colors hover:text-primary/80"
                >
                  <Ruler className="size-3" />
                  {sizeGuideOpen ? "Hide" : "Size Guide"}
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const active = selection[option.id] === value.id
                const available = hasAvailableProductVariant(
                  data,
                  selection,
                  option.id,
                  value.id
                )

                return (
                  <Button
                    key={value.id}
                    type="button"
                    variant={
                      isColor ? "outline" : active ? "default" : "outline"
                    }
                    size={isColor ? "icon" : "sm"}
                    onClick={() =>
                      onSelect({ ...selection, [option.id]: value.id })
                    }
                    aria-pressed={active}
                    aria-label={
                      isColor ? `Select color ${value.label}` : undefined
                    }
                    title={value.label}
                    className={cn(
                      "relative",
                      isColor
                        ? [
                            "hover:border-primary!",
                            active && "border-2! border-primary! p-0.5",
                          ]
                        : "min-w-8 overflow-hidden",
                      !available && "opacity-50"
                    )}
                  >
                    {isColor ? (
                      <span
                        aria-hidden="true"
                        className="block h-full w-full border border-border/50"
                        style={{
                          backgroundColor: value.colorCode ?? "transparent",
                        }}
                      />
                    ) : (
                      value.label
                    )}

                    {!available && (
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                        <span className="h-[1.5px] w-[140%] -rotate-45 bg-muted-foreground/40" />
                      </span>
                    )}
                  </Button>
                )
              })}
            </div>

            {isSize && sizeGuideOpen && sizeGuide && (
              <div className="space-y-2">
                {sizeGuide.columns.length && sizeGuide.rows.length ? (
                  <div className="overflow-hidden rounded-md border">
                    <table className="w-full text-sm">
                      <thead className="border-b bg-muted/30">
                        <tr>
                          {sizeGuide.columns.map((column) => (
                            <th
                              key={column}
                              className="h-8 px-2 text-center text-[11px] font-semibold uppercase"
                            >
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sizeGuide.rows.map((row, index) => (
                          <tr
                            key={String(row[sizeGuide.columns[0]] ?? index)}
                            className={cn(
                              "h-8 border-b last:border-0",
                              String(row[sizeGuide.columns[0]]) ===
                                selectedSize && "bg-primary/5"
                            )}
                          >
                            {sizeGuide.columns.map((column, columnIndex) => (
                              <td
                                key={column}
                                className={cn(
                                  "px-2 py-1.5 text-center text-xs",
                                  columnIndex === 0 && "font-medium",
                                  columnIndex === 0 &&
                                    String(row[column]) === selectedSize &&
                                    "text-primary"
                                )}
                              >
                                {row[column] ?? "—"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="rounded-md border p-3 text-xs text-muted-foreground">
                    Size guide is currently unavailable.
                  </p>
                )}
                {(sizeGuide.unit || sizeGuide.description) && (
                  <p className="text-[10px] text-muted-foreground">
                    {sizeGuide.unit ? (
                      <>
                        Measurements in{" "}
                        <span className="text-primary">{sizeGuide.unit}</span>.
                      </>
                    ) : null}
                    {sizeGuide.description ? ` ${sizeGuide.description}` : ""}
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
