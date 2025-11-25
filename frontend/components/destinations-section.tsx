"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import api from "@/lib/api"
import { fadeIn, staggerContainer, textVariant } from "@/lib/motion"
import { useIsMobile } from "@/hooks/use-mobile"

interface Destination {
  id: number
  name: string
  count: string
  imageUrl: string
}

export default function DestinationsSection() {
  const isMobile = useIsMobile()
  const [scrollPosition, setScrollPosition] = useState(0)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [dragLimit, setDragLimit] = useState(0)

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await api.get("/api/properties/")
        const properties = response.data
        
        // Group by location
        const locationMap = new Map<string, number>()
        // Static image mapping for known locations
        const staticImages: Record<string, string> = {
          "New York": "/properties/retailshop.png",
          "Paris": "/properties/paris_apr.png",
          "Dubai": "/properties/dubaivilla.png",
          "Los Angeles": "/properties/malibu-beach-sunset-california.jpg",
          "Miami": "/properties/luxury-mansion-with-ocean-view.jpg",
          "London": "/properties/heritage.png",
          "Beverly Hills": "/properties/malibu-beach-sunset-california.jpg",
        }

        properties.forEach((prop: any) => {
          const loc = prop.location.split(',')[0].trim() // Simple city extraction
          locationMap.set(loc, (locationMap.get(loc) || 0) + 1)
        })

        const dests: Destination[] = Array.from(locationMap.entries()).map(([name, count], index) => ({
          id: index,
          name,
          count: `${count} listings`,
          imageUrl: staticImages[name] || "/properties/placeholder.jpg"
        }))

        setDestinations(dests)
      } catch (err) {
        console.error("Failed to fetch destinations", err)
        setError("Failed to load destinations.")
      } finally {
        setLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  useEffect(() => {
    const measure = () => {
      const container = scrollContainerRef.current
      if (container) {
        const limit = Math.max(container.scrollWidth - container.clientWidth, 0)
        setDragLimit(limit)
      }
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current
    if (!container) return
    const scrollAmount = 360
    const newPosition = direction === "left" ? scrollPosition - scrollAmount : scrollPosition + scrollAmount
    container.scrollTo({ left: newPosition, behavior: "smooth" })
    setScrollPosition(newPosition)
  }

  if (loading) {
      return (
        <section className="py-20 bg-white border-t border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        </section>
      )
  }

  if (error) {
      return (
        <section className="py-20 bg-white border-t border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-red-500">
                {error}
            </div>
        </section>
      )
  }

  if (destinations.length === 0) return null

  return (
    <section id="destinations" className="py-20 bg-white border-t border-b border-border">
      <motion.div
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-12">
          <motion.h2 
            variants={textVariant(0.1)}
            className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4"
          >
            Explore by Destination
          </motion.h2>
          <motion.p 
            variants={fadeIn("up", "tween", 0.2, 1)}
            className="text-lg text-muted-foreground"
          >
            Discover homes in the world's most desired locales
          </motion.p>
        </div>

        {/* Slider Container */}
        <motion.div
          variants={fadeIn("up", "tween", 0.4, 1)}
          className="relative"
        >
          <motion.div
            id="destinations-scroll"
            ref={scrollContainerRef}
            drag="x"
            dragConstraints={{ left: -dragLimit, right: 0 }}
            dragElastic={isMobile ? 0.08 : 0.12}
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4 touch-pan-x snap-x snap-mandatory"
            whileTap={{ cursor: "grabbing" }}
          >
            {destinations.map((dest) => (
              <motion.div
                key={dest.id}
                className="flex-shrink-0 w-72 group cursor-pointer snap-start"
                whileHover={{ scale: isMobile ? 1.01 : 1.04 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative h-64 rounded-xl overflow-hidden mb-4 bg-muted shadow-md group-hover:shadow-2xl transition-shadow duration-500">
                  <motion.img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: isMobile ? 1.04 : 1.12, rotate: isMobile ? 0 : 1.5 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition duration-300"></div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <motion.h3
                      className="text-2xl font-serif font-bold mb-2"
                      initial={{ y: 0 }}
                      whileHover={{ y: isMobile ? -2 : -6 }}
                    >
                      {dest.name}
                    </motion.h3>
                    <motion.p
                      className="text-sm text-white/90"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {dest.count}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 backdrop-blur rounded-full p-3 shadow-lg hover:bg-gray-50 transition z-10"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} className="text-foreground" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 backdrop-blur rounded-full p-3 shadow-lg hover:bg-gray-50 transition z-10"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} className="text-foreground" />
          </button>
        </motion.div>
      </motion.div>
    </section>
  )
}
