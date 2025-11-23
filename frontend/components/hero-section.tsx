"use client"
import { ChevronRight } from "lucide-react"

export default function HeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      id="hero"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src="/luxury-mansion-with-ocean-view.jpg" alt="Luxury property" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fadeIn">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight text-balance">
          Discover Extraordinary Homes
        </h1>
        <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto text-balance leading-relaxed">
          Luxury properties curated from the world's most coveted destinations.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => scrollToSection("featured-properties")}
            className="group px-8 py-4 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition inline-flex items-center justify-center gap-2"
          >
            Book Now
            <ChevronRight size={20} className="group-hover:translate-x-1 transition" />
          </button>
          <button
            onClick={() => scrollToSection("cta-section")}
            className="px-8 py-4 bg-primary/20 text-white border-2 border-white rounded-lg hover:bg-primary/30 transition font-semibold"
          >
            Talk to an Expert
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="animate-bounce text-white text-sm flex flex-col items-center gap-2">
          <span>Scroll to explore</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
