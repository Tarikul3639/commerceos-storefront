import Image from "next/image"
import Link from "next/link"
import { ImageIcon } from "lucide-react"

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
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="group min-w-0"
        >
          <div className="relative aspect-square overflow-hidden rounded-none bg-muted">
            {product.images[0] ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-muted-foreground">
                <ImageIcon className="size-8 opacity-50" />
              </div>
            )}
          </div>
          <div className="pt-2.5">
            <h2 className="line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
              {product.name}
            </h2>
            <p className="mt-1 text-sm font-semibold text-foreground">
              ৳{Number(product.sellingPrice).toLocaleString("en-BD")}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
