"use client"

import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"

/** Reusable search trigger for desktop, mobile and drawer placements. */
export function SearchTrigger({
  variant,
  onOpen,
  onBeforeOpen,
}: {
  variant: "desktop" | "mobile" | "drawer"
  onOpen: () => void
  onBeforeOpen?: () => void
}) {
  const handleClick = () => {
    if (onBeforeOpen) {
      onBeforeOpen()
      window.setTimeout(onOpen, 200)
      return
    }

    onOpen()
  }

  if (variant === "desktop" || variant === "drawer") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label="Search products"
        aria-haspopup="dialog"
        className="flex h-11 w-full items-center gap-3 rounded-full border border-transparent bg-muted px-4 text-sm text-muted-foreground transition-colors outline-none hover:bg-muted/70 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <Search aria-hidden="true" className="size-4 shrink-0" />
        <span className="flex-1 truncate text-left">Search products</span>
        <kbd
          aria-hidden="true"
          className="hidden h-5 items-center rounded border border-border bg-background px-1.5 text-[11px] font-medium sm:inline-flex"
        >
          ⌘K / Ctrl K
        </kbd>
      </button>
    )
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="text-foreground/80 hover:bg-muted hover:text-foreground md:hidden"
      aria-label="Search"
      aria-haspopup="dialog"
      onClick={handleClick}
    >
      <Search className="size-5" />
    </Button>
  )
}
