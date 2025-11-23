"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (id: string) => {
    setIsOpen(false)
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <span className="text-primary-foreground font-serif font-bold text-lg">L</span>
            </div>
            <span className="font-serif text-xl font-bold text-foreground hidden sm:inline">LuxEstate</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection("featured-properties")}
              className="text-foreground hover:text-primary transition font-medium"
            >
              Properties
            </button>
            <button
              onClick={() => scrollToSection("destinations")}
              className="text-foreground hover:text-primary transition font-medium"
            >
              Destinations
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-foreground hover:text-primary transition font-medium"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-foreground hover:text-primary transition font-medium"
            >
              Testimonials
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="px-6 py-2 text-foreground border border-foreground rounded-lg hover:bg-foreground hover:text-background transition font-medium">
              Sign In
            </button>
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium">
              Schedule Tour
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-foreground" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3 bg-background">
            <button
              onClick={() => scrollToSection("featured-properties")}
              className="block w-full text-left py-2 px-4 text-foreground hover:text-primary hover:bg-primary/5 rounded transition"
            >
              Properties
            </button>
            <button
              onClick={() => scrollToSection("destinations")}
              className="block w-full text-left py-2 px-4 text-foreground hover:text-primary hover:bg-primary/5 rounded transition"
            >
              Destinations
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="block w-full text-left py-2 px-4 text-foreground hover:text-primary hover:bg-primary/5 rounded transition"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="block w-full text-left py-2 px-4 text-foreground hover:text-primary hover:bg-primary/5 rounded transition"
            >
              Testimonials
            </button>
            <div className="flex space-x-2 pt-4 px-4">
              <button className="flex-1 px-4 py-2 text-foreground border border-foreground rounded-lg hover:bg-foreground hover:text-background transition text-sm font-medium">
                Sign In
              </button>
              <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition text-sm font-medium">
                Tour
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
