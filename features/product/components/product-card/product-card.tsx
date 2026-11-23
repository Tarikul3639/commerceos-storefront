"use client"

import Link from "next/link"
import { Flame } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ProductCardActions } from "./product-card-actions"
import { ProductCardImage } from "./product-card-image"
import type { ProductCardProps } from "./product-card.types"

export function ProductCard({
    product,
    priority = false,
    isHorizontal = false,
    badgeLabel = "Best Selling",
}: ProductCardProps) {
    const [image] = product.images
    const isOutOfStock = product.stock <= 0
    const sellingPrice = Number(product.sellingPrice)
    const originalPrice = Number(product.originalPrice)

    const hasDiscount =
        product.originalPrice != null &&
        Number.isFinite(originalPrice) &&
        originalPrice > sellingPrice

    return (
        <article
            className={`group relative flex min-w-0 flex-col overflow-hidden border border-border/70 bg-card transition-shadow duration-300 hover:shadow-md ${isHorizontal ? "rounded-xs min-h-48 sm:max-h-64 sm:flex-row" : ""
                }`}
        >
            {isHorizontal && badgeLabel && (
                <Badge className="absolute top-0 right-0 z-10 gap-1 rounded-tl-none sm:rounded-tr-xs rounded-br-none rounded-bl-md bg-red-500 px-2.5 py-1 text-xs text-white hover:bg-red-500">
                    <Flame className="size-3.5" />
                    {badgeLabel}
                </Badge>
            )}

            <ProductCardImage
                product={product}
                priority={priority}
                isHorizontal={isHorizontal}
                isOutOfStock={isOutOfStock}
                hasDiscount={hasDiscount}
            />

            <div
                className={`flex min-w-0 flex-1 flex-col gap-2 p-3 ${isHorizontal ? "sm:justify-center sm:gap-3 sm:px-5 sm:py-6" : ""
                    }`}
            >
                <Link
                    href={`/products/${product.id}`}
                    className={`line-clamp-2 font-medium text-foreground transition-colors text-sm hover:text-primary ${isHorizontal
                        ? "sm:pr-14 text-lg sm:font-semibold"
                        : "text-sm leading-5"
                        }`}
                >
                    {product.name}
                </Link>

                <div
                    className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 ${isHorizontal ? "sm:gap-x-4" : "mt-auto"
                        }`}
                >
                    <p
                        className={`font-semibold text-primary ${isHorizontal
                            ? "sm:text-lg sm:font-bol"
                            : "text-sm"
                            }`}
                    >
                        ৳{sellingPrice.toLocaleString("en-BD")}
                    </p>
                    {hasDiscount && (
                        <p className="text-xs text-muted-foreground line-through">
                            ৳{originalPrice.toLocaleString("en-BD")}
                        </p>
                    )}
                </div>

                {isHorizontal && hasDiscount && (
                    <Badge className="hidden w-fit rounded-full bg-lime-400 dark:bg-lime-500 px-3 py-1 text-xs font-normal text-black hover:bg-lime-500 dark:hover:bg-lime-400 sm:inline-flex">
                        Save ৳{(originalPrice - sellingPrice).toLocaleString("en-BD")}
                    </Badge>
                )}

                <ProductCardActions
                    product={product}
                    image={image}
                    sellingPrice={sellingPrice}
                    isOutOfStock={isOutOfStock}
                    isHorizontal={isHorizontal}
                />
            </div>
        </article>
    )
}
