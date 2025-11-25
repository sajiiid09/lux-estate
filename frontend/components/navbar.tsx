"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { useState, type MouseEvent } from "react"
import { Menu, X, User as UserIcon, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { navVariants } from "@/lib/motion"
import { useAuth } from "@/context/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
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
            <Link href="/properties" className="text-foreground hover:text-primary transition font-medium">
              Properties
            </Link>
            <Link href="/bookings" className="text-foreground hover:text-primary transition font-medium">
              Bookings
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition font-medium">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <div className="flex items-center gap-2 px-4 py-2 text-foreground border border-foreground/20 rounded-lg hover:bg-foreground/5 transition font-medium cursor-pointer">
                    <UserIcon size={18} />
                    <span>{user.first_name || user.email.split('@')[0]}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-sm border-border">
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 text-foreground border border-foreground rounded-lg hover:bg-foreground hover:text-background transition font-medium"
              >
                Sign In
              </Link>
            )}
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
                href="/properties"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left py-2 px-4 text-foreground hover:text-primary hover:bg-primary/5 rounded transition"
              >
                Properties
              </Link>
              <Link
                href="/bookings"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left py-2 px-4 text-foreground hover:text-primary hover:bg-primary/5 rounded transition"
              >
                Bookings
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left py-2 px-4 text-foreground hover:text-primary hover:bg-primary/5 rounded transition"
              >
                Contact
              </Link>
              <div className="flex space-x-2 pt-4 px-4">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout()
                      setIsOpen(false)
                    }}
                    className="flex-1 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-600 hover:text-white transition text-sm font-medium text-center flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-2 text-foreground border border-foreground rounded-lg hover:bg-foreground hover:text-background transition text-sm font-medium text-center"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
