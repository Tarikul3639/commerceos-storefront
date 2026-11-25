"use client"

import { useState } from "react"
import { Check, Filter, RotateCcw, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import type { StoreBrand } from "@/features/brands/api/brand.api"
import type { StoreCategory } from "@/features/home/types/category.types"
import type { StoreProductFilters } from "@/features/product/api/product.api"

type ProductFilterValues = Pick<
  StoreProductFilters,
  "categoryId" | "brandId" | "minPrice" | "maxPrice" | "inStock" | "isFeatured"
>

type ProductFiltersSheetProps = {
  categories: StoreCategory[]
  brands: StoreBrand[]
  values: ProductFilterValues
  activeCount: number
  onApply: (values: ProductFilterValues) => void
}

const PRICE_MIN = 0
const PRICE_MAX = 100_000
const PRICE_STEP = 100

export function ProductFiltersSheet({
  categories,
  brands,
  values,
  activeCount,
  onApply,
}: ProductFiltersSheetProps) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<ProductFilterValues>(values)

  function update<K extends keyof ProductFilterValues>(
    key: K,
    value: ProductFilterValues[K]
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }))
  }

  function resetDraft() {
    setDraft({})
  }

  function applyDraft() {
    onApply(draft)
    setOpen(false)
  }

  const priceRange: [number, number] = [
    Math.min(draft.minPrice ?? PRICE_MIN, draft.maxPrice ?? PRICE_MAX),
    Math.max(draft.minPrice ?? PRICE_MIN, draft.maxPrice ?? PRICE_MAX),
  ]

  function updatePriceRange(nextRange: number[]) {
    const [min, max] = nextRange

    setDraft((current) => ({
      ...current,
      minPrice: min > PRICE_MIN ? min : undefined,
      maxPrice: max < PRICE_MAX ? max : undefined,
    }))
  }

  function updateMinPrice(value: string) {
    const parsed = Number(value)

    if (value === "") {
      update("minPrice", undefined)
      return
    }

    const min = Math.max(PRICE_MIN, Math.min(parsed, PRICE_MAX))
    const max = draft.maxPrice ?? PRICE_MAX

    setDraft((current) => ({
      ...current,
      minPrice: min > PRICE_MIN ? min : undefined,
      maxPrice:
        min > max ? (min < PRICE_MAX ? min : undefined) : current.maxPrice,
    }))
  }

  function updateMaxPrice(value: string) {
    const parsed = Number(value)

    if (value === "") {
      update("maxPrice", undefined)
      return
    }

    const max = Math.max(PRICE_MIN, Math.min(parsed, PRICE_MAX))
    const min = draft.minPrice ?? PRICE_MIN

    setDraft((current) => ({
      ...current,
      maxPrice: max < PRICE_MAX ? max : undefined,
      minPrice:
        max < min ? (max > PRICE_MIN ? max : undefined) : current.minPrice,
    }))
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) setDraft(values)
        setOpen(nextOpen)
      }}
    >
      {/* Trigger */}
      <SheetTrigger asChild>
        <Button variant="outline" className="relative gap-2">
          <Filter className="size-3.5" />
          Filters
          {activeCount > 0 && (
            <span className="grid size-4 place-items-center bg-primary text-[9px] text-primary-foreground">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="flex h-dvh flex-col gap-0 overflow-hidden p-0"
      >
        {/* Fixed Header */}
        <SheetHeader className="shrink-0 border-b border-border px-5 py-4 pr-12">
          <SheetTitle className="flex items-center gap-2 text-base">
            <SlidersHorizontal className="size-4" />
            Filter products
          </SheetTitle>
        </SheetHeader>

        {/* Scrollable Filter Content */}
        <ScrollArea className="min-h-0 flex-1">
          <div className="flex min-h-full flex-col justify-between px-5">
            {/* Category & Brand */}
            <div className="mt-auto shrink-0 border-t border-border">
              {/* Category */}
              <Accordion
                type="single"
                collapsible
                // defaultValue="category"
                className="w-full"
              >
                <AccordionItem value="category">
                  <AccordionTrigger className="py-3 text-xs font-semibold hover:no-underline">
                    <span className="flex items-center gap-2">
                      Category
                      {draft.categoryId && (
                        <span className="size-1.5 rounded-full bg-primary" />
                      )}
                    </span>
                  </AccordionTrigger>

                  <AccordionContent>
                    <RadioGroup
                      value={draft.categoryId ?? "all"}
                      onValueChange={(value) =>
                        update(
                          "categoryId",
                          value === "all" ? undefined : value
                        )
                      }
                      className="space-y-2 pb-3"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="all" id="category-all" />
                        <Label
                          htmlFor="category-all"
                          className="cursor-pointer text-xs font-normal"
                        >
                          All categories
                        </Label>
                      </div>

                      {categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center gap-2"
                        >
                          <RadioGroupItem
                            value={category.id}
                            id={`category-${category.id}`}
                          />

                          <Label
                            htmlFor={`category-${category.id}`}
                            className="cursor-pointer text-xs font-normal"
                          >
                            {category.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Brand */}
              {brands.length > 0 && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="brand">
                    <AccordionTrigger className="py-3 text-xs font-semibold hover:no-underline">
                      <span className="flex items-center gap-2">
                        Brand
                        {draft.brandId && (
                          <span className="size-1.5 rounded-full bg-primary" />
                        )}
                      </span>
                    </AccordionTrigger>

                    <AccordionContent>
                      <RadioGroup
                        value={draft.brandId ?? "all"}
                        onValueChange={(value) =>
                          update("brandId", value === "all" ? undefined : value)
                        }
                        className="space-y-2 pb-3"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="all" id="brand-all" />
                          <Label
                            htmlFor="brand-all"
                            className="cursor-pointer text-xs font-normal"
                          >
                            All brands
                          </Label>
                        </div>

                        {brands.map((brand) => (
                          <div
                            key={brand.id}
                            className="flex items-center gap-2"
                          >
                            <RadioGroupItem
                              value={brand.id}
                              id={`brand-${brand.id}`}
                            />

                            <Label
                              htmlFor={`brand-${brand.id}`}
                              className="cursor-pointer text-xs font-normal"
                            >
                              {brand.name}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </div>

            {/* Availability & Price */}
            <div className="flex shrink-0 flex-col">
              {/* Availability */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="availability">
                  <AccordionTrigger className="py-3 text-xs font-semibold hover:no-underline">
                    <span className="flex items-center gap-2">
                      Availability & highlights
                      {(draft.inStock || draft.isFeatured) && (
                        <span className="size-1.5 rounded-full bg-primary" />
                      )}
                    </span>
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="space-y-3 pb-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="in-stock"
                          checked={draft.inStock ?? false}
                          onCheckedChange={(checked) =>
                            update("inStock", checked === true || undefined)
                          }
                        />

                        <Label
                          htmlFor="in-stock"
                          className="cursor-pointer text-xs font-normal"
                        >
                          In stock only
                        </Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="featured"
                          checked={draft.isFeatured ?? false}
                          onCheckedChange={(checked) =>
                            update("isFeatured", checked === true || undefined)
                          }
                        />

                        <Label
                          htmlFor="featured"
                          className="cursor-pointer text-xs font-normal"
                        >
                          Featured products
                        </Label>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Price Range */}
              <Accordion
                type="single"
                collapsible
                defaultValue="price"
                className="w-full"
              >
                <AccordionItem value="price" className="border-b-0">
                  <AccordionTrigger className="py-3 text-xs font-semibold hover:no-underline">
                    <span className="flex items-center gap-2">
                      Price range
                      {(draft.minPrice !== undefined ||
                        draft.maxPrice !== undefined) && (
                          <span className="size-1.5 rounded-full bg-primary" />
                        )}
                    </span>
                  </AccordionTrigger>

                  <AccordionContent>
                    <div className="space-y-5 px-1 pb-4">
                      {/* Price Inputs */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="min-price"
                            className="text-[11px] text-muted-foreground"
                          >
                            Minimum price
                          </Label>

                          <Input
                            id="min-price"
                            type="number"
                            min={PRICE_MIN}
                            max={PRICE_MAX}
                            step={PRICE_STEP}
                            value={draft.minPrice ?? ""}
                            onChange={(event) =>
                              updateMinPrice(event.target.value)
                            }
                            placeholder="৳0"
                            className="h-8 text-xs"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label
                            htmlFor="max-price"
                            className="text-[11px] text-muted-foreground"
                          >
                            Maximum price
                          </Label>

                          <Input
                            id="max-price"
                            type="number"
                            min={PRICE_MIN}
                            max={PRICE_MAX}
                            step={PRICE_STEP}
                            value={draft.maxPrice ?? ""}
                            onChange={(event) =>
                              updateMaxPrice(event.target.value)
                            }
                            placeholder="৳100,000"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>

                      {/* Slider Values */}
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-muted-foreground">
                          ৳{priceRange[0].toLocaleString("en-BD")}
                        </span>

                        <span className="text-muted-foreground">
                          ৳{priceRange[1].toLocaleString("en-BD")}
                        </span>
                      </div>

                      {/* Price Slider */}
                      <Slider
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        step={PRICE_STEP}
                        value={priceRange}
                        onValueChange={updatePriceRange}
                        aria-label="Product price range"
                      />

                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>৳0</span>
                        <span>৳100,000+</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </ScrollArea>

        {/* Fixed Footer */}
        <SheetFooter className="grid shrink-0 grid-cols-2 border-t border-border px-5 py-4">
          <Button variant="outline" onClick={resetDraft}>
            <RotateCcw className="size-3.5" />
            Reset
          </Button>

          <Button onClick={applyDraft}>
            <Check className="size-3.5" />
            Apply filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
