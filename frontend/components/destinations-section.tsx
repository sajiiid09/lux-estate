"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import api from "@/lib/api"

interface Destination {
  id: number
  name: string
  count: string
  imageUrl: string
}

export default function DestinationsSection() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await api.get("/api/properties/")
        const properties = response.data
        
        // Group by location
        const locationMap = new Map<string, number>()
        const locationImages = new Map<string, string>()

        properties.forEach((prop: any) => {
          const loc = prop.location.split(',')[0].trim() // Simple city extraction
          locationMap.set(loc, (locationMap.get(loc) || 0) + 1)
          if (!locationImages.has(loc)) {
            locationImages.set(loc, prop.image)
          }
        })

        const dests: Destination[] = Array.from(locationMap.entries()).map(([name, count], index) => ({
          id: index,
          name,
          count: `${count} listings`,
          imageUrl: locationImages.get(name) || "/placeholder.svg"
        }))

        setDestinations(dests)
      } catch (err) {
        console.error("Failed to fetch destinations", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("destinations-scroll")
    if (container) {
      const scrollAmount = 400
      const newPosition = direction === "left" ? scrollPosition - scrollAmount : scrollPosition + scrollAmount
      container.scrollLeft = newPosition
      setScrollPosition(newPosition)
    }
  }

  if (loading) return null // Or a skeleton

  if (destinations.length === 0) return null

  return (
    <section id="destinations" className="py-20 bg-white border-t border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">Explore by Destination</h2>
          <p className="text-lg text-muted-foreground">Discover homes in the world's most desired locales</p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          <div id="destinations-scroll" className="flex gap-6 overflow-x-hidden scroll-smooth">
            {destinations.map((dest) => (
              <div key={dest.id} className="flex-shrink-0 w-72 group cursor-pointer">
                <div className="relative h-64 rounded-lg overflow-hidden mb-4 bg-muted">
                  <img
                    src={dest.imageUrl || "/placeholder.svg"}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition"></div>

                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-2xl font-serif font-bold mb-2">{dest.name}</h3>
                    <p className="text-sm text-white/90">{dest.count}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition z-10"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} className="text-foreground" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition z-10"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} className="text-foreground" />
          </button>
        </div>
      </div>
    </section>
  )
}
