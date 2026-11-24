"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Megaphone } from "lucide-react"
import { motion, useAnimationControls, useReducedMotion } from "motion/react"

interface AnnouncementMessageProps {
  message: string
}

export function AnnouncementMessage({ message }: AnnouncementMessageProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const messageRef = useRef<HTMLSpanElement>(null)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const controls = useAnimationControls()
  const shouldAnimate = isOverflowing && !prefersReducedMotion
  const duration = Math.max(12, message.length * 0.3)

  const startMarquee = useCallback(
    () =>
      controls.start({
        x: ["0%", "-50%"],
        transition: {
          duration,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      }),
    [controls, duration]
  )

  useEffect(() => {
    if (shouldAnimate) {
      void startMarquee()
    } else {
      controls.set({ x: "0%" })
    }
  }, [controls, shouldAnimate, startMarquee])

  useEffect(() => {
    const viewport = viewportRef.current
    const content = messageRef.current

    if (!viewport || !content) return

    const measure = () => {
      setIsOverflowing(content.scrollWidth > viewport.clientWidth + 2)
    }

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(viewport)
    observer.observe(content)

    return () => observer.disconnect()
  }, [message])

  return (
    <div
      ref={viewportRef}
      className={`min-w-0 flex-1 ${isOverflowing && prefersReducedMotion ? "overflow-x-auto" : "overflow-hidden"}`}
      aria-label={message}
    >
      <motion.div
        className={isOverflowing ? "flex w-max" : "flex justify-center"}
        animate={controls}
        onHoverStart={() => {
          if (shouldAnimate) controls.stop()
        }}
        onHoverEnd={() => {
          if (shouldAnimate) void startMarquee()
        }}
      >
        <span
          ref={messageRef}
          className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap ${shouldAnimate ? "pr-16" : ""}`}
        >
          <Megaphone aria-hidden="true" className="size-3.5 shrink-0" />
          {message}
        </span>
        {shouldAnimate && (
          <span
            aria-hidden="true"
            className="inline-flex shrink-0 items-center gap-2 pr-16 whitespace-nowrap"
          >
            <Megaphone className="size-3.5 shrink-0" />
            {message}
          </span>
        )}
      </motion.div>
    </div>
  )
}
