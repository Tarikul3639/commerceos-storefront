import { ProductCard } from "@/components/product-card"
import type { StoreProduct } from "../api/product.api"

export function ProductGrid({ products }: { products: StoreProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="border border-dashed border-border px-4 py-16 text-center">
        <p className="text-sm font-medium text-foreground">No products yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Products in this category will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
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
