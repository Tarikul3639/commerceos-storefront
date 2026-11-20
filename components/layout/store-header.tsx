"use client"

import { useEffect, useState } from "react"

import { DesktopNavigation } from "@/components/layout/desktop-navigation"
import { StoreMainHeader } from "@/components/layout/store-main-header"
import { SearchDialog } from "@/features/search/components/search-dialog"

/**
 * Composes the sticky masthead, desktop navigation and shared search dialog.
 * Keyboard shortcuts and dialog state live here so every search trigger uses one dialog.
 */
export function StoreHeader() {
  const [searchOpen, setSearchOpen] = useState(false)

  // Support the conventional command shortcut and slash-to-search without hijacking text entry.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable

      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setSearchOpen((current) => !current)
      } else if (
        event.key === "/" &&
        !typing &&
        !event.metaKey &&
        !event.ctrlKey
      ) {
        event.preventDefault()
        setSearchOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <>
      <StoreMainHeader onOpenSearch={() => setSearchOpen(true)} />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <DesktopNavigation />
      </div>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
