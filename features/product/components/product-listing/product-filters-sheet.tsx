"use client"

import { useState } from "react"
import { Check, Filter, RotateCcw, SlidersHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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

/** Left-side catalog drawer with collapsible filter groups and a scrollable body. */
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
    setDraft((current) => ({ ...current, [key]: value }))
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

  return (
    <Sheet
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) setDraft(values)
        setOpen(nextOpen)
      }}
    >
      <SheetTrigger asChild>
        <Button variant="outline" className="relative gap-2">
          <Filter className="size-3.5" />
          Filters
          {activeCount > 0 ? (
            <span className="grid size-4 place-items-center bg-primary text-[9px] text-primary-foreground">
              {activeCount}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="gap-0 p-0">
        <SheetHeader className="border-b border-border px-5 py-4 pr-12">
          <SheetTitle className="flex items-center gap-1.5 text-base">
            <SlidersHorizontal className="size-4" />
            Filter products
          </SheetTitle>
        </SheetHeader>

        <div className="flex h-full flex-col justify-between overflow-scroll px-5">
          {/* First section */}
          <div className="mt-auto shrink-0 overflow-scroll overflow-y-auto border-t border-border">
            <Accordion
              type="single"
              collapsible
              defaultValue="category"
              className="w-full"
            >
              <AccordionItem value="category">
                <AccordionTrigger className="py-3 text-xs font-semibold hover:no-underline">
                  <span className="flex items-center gap-2">
                    Category
                    {draft.categoryId ? (
                      <span className="size-1.5 rounded-full bg-primary" />
                    ) : null}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="h-[min(25vh,12rem)]">
                    <div className="space-y-2 pr-3 pb-3">
                      <label className="flex cursor-pointer items-center gap-2 text-xs">
                        <input
                          type="radio"
                          name="product-category"
                          checked={!draft.categoryId}
                          onChange={() => update("categoryId", undefined)}
                          className="size-3.5 accent-primary"
                        />
                        All categories
                      </label>
                      {categories.map((category) => (
                        <label
                          key={category.id}
                          className="flex cursor-pointer items-center gap-2 text-xs"
                        >
                          <input
                            type="radio"
                            name="product-category"
                            checked={draft.categoryId === category.id}
                            onChange={() => update("categoryId", category.id)}
                            className="size-3.5 accent-primary"
                          />
                          <span>{category.name}</span>
                        </label>
                      ))}
                    </div>
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {brands.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="brand">
                  <AccordionTrigger className="py-3 text-xs font-semibold hover:no-underline">
                    <span className="flex items-center gap-2">
                      Brand
                      {draft.brandId ? (
                        <span className="size-1.5 rounded-full bg-primary" />
                      ) : null}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ScrollArea className="h-[min(25vh,12rem)]">
                      <div className="space-y-2 pr-3 pb-3">
                        <label className="flex cursor-pointer items-center gap-2 text-xs">
                          <input
                            type="radio"
                            name="product-brand"
                            checked={!draft.brandId}
                            onChange={() => update("brandId", undefined)}
                            className="size-3.5 accent-primary"
                          />
                          All brands
                        </label>
                        {brands.map((brand) => (
                          <label
                            key={brand.id}
                            className="flex cursor-pointer items-center gap-2 text-xs"
                          >
                            <input
                              type="radio"
                              name="product-brand"
                              checked={draft.brandId === brand.id}
                              onChange={() => update("brandId", brand.id)}
                              className="size-3.5 accent-primary"
                            />
                            <span>{brand.name}</span>
                          </label>
                        ))}
                      </div>
                    </ScrollArea>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : null}
          </div>

          <div className="flex flex-col">
            {/* Second Section */}
            <Accordion type="single" collapsible className="h-full w-full">
              <AccordionItem value="availability">
                <AccordionTrigger className="py-3 text-xs font-semibold hover:no-underline">
                  <span className="flex items-center gap-2">
                    Availability & highlights
                    {draft.inStock || draft.isFeatured ? (
                      <span className="size-1.5 rounded-full bg-primary" />
                    ) : null}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pb-3">
                    <label className="flex cursor-pointer items-center gap-2 text-xs">
                      <Checkbox
                        checked={draft.inStock ?? false}
                        onCheckedChange={(checked) =>
                          update("inStock", checked === true || undefined)
                        }
                      />
                      In stock only
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-xs">
                      <Checkbox
                        checked={draft.isFeatured ?? false}
                        onCheckedChange={(checked) =>
                          update("isFeatured", checked === true || undefined)
                        }
                      />
                      Featured products
                    </label>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

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
                    {draft.minPrice !== undefined ||
                      draft.maxPrice !== undefined ? (
                      <span className="size-1.5 rounded-full bg-primary" />
                    ) : null}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-5 px-1 pb-4">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-muted-foreground">
                        ৳{priceRange[0].toLocaleString("en-BD")}
                      </span>
                      <span className="text-muted-foreground">
                        ৳{priceRange[1].toLocaleString("en-BD")}
                      </span>
                    </div>
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

        <SheetFooter className="grid grid-cols-2 border-t border-border px-5 py-4">
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
