"use client"

import { useSyncExternalStore } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

const subscribe = () => () => {}
const getMountedSnapshot = () => true
const getServerSnapshot = () => false

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    subscribe,
    getMountedSnapshot,
    getServerSnapshot
  )
  const isDark = resolvedTheme === "dark"
  const targetThemeLabel = isDark ? "Light" : "Dark"

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={
        mounted
          ? `Switch to ${targetThemeLabel.toLowerCase()} mode`
          : "Toggle color theme"
      }
      title={
        mounted
          ? `Switch to ${targetThemeLabel.toLowerCase()} mode`
          : "Toggle color theme"
      }
      className="size-9 shrink-0 text-foreground/80 hover:bg-muted hover:text-primary sm:flex md:h-11 md:w-auto md:flex-col md:gap-0.5 md:px-3 md:text-[11px] md:font-medium"
      disabled={!mounted}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted && isDark ? (
        <Sun className="size-5" />
      ) : (
        <Moon className="size-5" />
      )}

      <span className="hidden md:inline">
        {mounted ? targetThemeLabel : "Theme"}
      </span>
    </Button>
  )
}
