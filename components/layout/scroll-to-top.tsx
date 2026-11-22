"use client"

import { useState } from "react"
import { ChevronUp } from "lucide-react"
import { motion, useMotionValueEvent, useScroll } from "motion/react"

import { Button } from "@/components/ui/button"

const progressPath = "M 22 1 H 43 V 43 H 1 V 1 H 22"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest > 20)
  })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <motion.div
      initial={false}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.85,
        y: isVisible ? 0 : 12,
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="pointer-events-none fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6"
      aria-hidden={!isVisible}
    >
      <div className="relative flex size-9 items-center justify-center">
        <svg
          className="pointer-events-none absolute inset-0 size-full"
          viewBox="0 0 44 44"
          fill="none"
          aria-hidden="true"
        >
          <path
            d={progressPath}
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeWidth="1.5"
          />
          <motion.path
            d={progressPath}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="butt"
            style={{ pathLength: scrollYProgress }}
          />
        </svg>

        <Button
          type="button"
          size="icon"
          variant="secondary"
          onClick={scrollToTop}
          tabIndex={isVisible ? 0 : -1}
          aria-label="Scroll to top"
          className="pointer-events-auto size-9 rounded-none border-none bg-background shadow-md hover:bg-muted"
        >
          <ChevronUp className="size-4.5" />
        </Button>
      </div>
    </motion.div>
  )
}
