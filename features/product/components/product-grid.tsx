import { ProductCard } from "@/features/product/components/product-card"
import type { ProductCardData } from "@/features/product/types/product.types"

interface ProductGridProps {
  products: ProductCardData[]
  emptyMessage?: string
}

export function ProductGrid({
  products,
  emptyMessage = "No products found.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="border border-dashed border-border px-4 py-16 text-center">
        <p className="text-sm font-medium text-foreground">No products yet</p>
        <p className="mt-1 text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 sm:gap-4 lg:grid-cols-5">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index === 0}
        />
      ))}
    </div>
  )
}
