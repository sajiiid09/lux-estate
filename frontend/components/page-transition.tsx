"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"

const transition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1],
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={transition}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
