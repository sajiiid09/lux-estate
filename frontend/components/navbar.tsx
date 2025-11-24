"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useState, type MouseEvent } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { navVariants } from "@/lib/motion"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const scrollToSection = (id: string) => {
    setIsOpen(false)
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  const handleDestinationClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      event.preventDefault()
      scrollToSection("destinations")
    } else {
      setIsOpen(false)
      router.push("/#destinations")
    }
  }

  return (
    <motion.nav 
      variants={navVariants}
      initial="hidden"
      animate="show"
      className="sticky top-0 z-50 bg-background border-b border-border backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-bold text-lg">L</span>
            </div>
            <span className="font-serif text-xl font-bold text-foreground hidden sm:inline">LuxEstate</span>
          </Link>

          <div className="hidden md:flex items-center gap-6 ml-auto">
            <Link
              href="/#destinations"
              onClick={handleDestinationClick}
              className="text-foreground hover:text-primary transition font-medium"
            >
              Destination
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition font-medium">
              About
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition font-medium">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-6 py-2 text-foreground border border-foreground rounded-lg hover:bg-foreground hover:text-background transition font-medium"
            >
              Sign In
            </Link>
          </div>

          <button className="md:hidden p-2 text-foreground ml-auto" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border py-4 space-y-3 bg-background overflow-hidden"
            >
              <Link
                href="/#destinations"
                onClick={(event) => {
                  handleDestinationClick(event)
                }}
                className="block w-full text-left py-2 px-4 text-foreground hover:text-primary hover:bg-primary/5 rounded transition"
              >
                Destination
              </Link>
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left py-2 px-4 text-foreground hover:text-primary hover:bg-primary/5 rounded transition"
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left py-2 px-4 text-foreground hover:text-primary hover:bg-primary/5 rounded transition"
              >
                Contact
              </Link>
              <div className="flex space-x-2 pt-4 px-4">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 px-4 py-2 text-foreground border border-foreground rounded-lg hover:bg-foreground hover:text-background transition text-sm font-medium text-center"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
