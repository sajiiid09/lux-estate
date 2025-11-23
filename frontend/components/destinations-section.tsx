"use client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface Destination {
  id: number
  name: string
  count: string
  imageUrl: string
}

const destinations: Destination[] = [
  {
    id: 1,
    name: "London",
    count: "324 listings",
    imageUrl: "/london-cityscape-skyline.jpg",
  },
  {
    id: 2,
    name: "New York",
    count: "512 listings",
    imageUrl: "/new-york-city-manhattan.jpg",
  },
  {
    id: 3,
    name: "Dubai",
    count: "287 listings",
    imageUrl: "/dubai-palm-jumeirah-luxury.jpg",
  },
  {
    id: 4,
    name: "Paris",
    count: "156 listings",
    imageUrl: "/paris-eiffel-tower-architecture.jpg",
  },
  {
    id: 5,
    name: "Malibu",
    count: "98 listings",
    imageUrl: "/malibu-beach-sunset-california.jpg",
  },
  {
    id: 6,
    name: "Miami",
    count: "203 listings",
    imageUrl: "/miami-beach-luxury-waterfront.jpg",
  },
]

export default function DestinationsSection() {
  const [scrollPosition, setScrollPosition] = useState(0)

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("destinations-scroll")
    if (container) {
      const scrollAmount = 400
      const newPosition = direction === "left" ? scrollPosition - scrollAmount : scrollPosition + scrollAmount
      container.scrollLeft = newPosition
      setScrollPosition(newPosition)
    }
  }

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
