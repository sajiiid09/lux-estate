"use client"
import { Heart, MapPin, Bed, Bath, Zap } from "lucide-react"
import { useState } from "react"

interface PropertyCardProps {
  id: number
  title: string
  location: string
  price: string
  beds: number
  baths: number
  area: string
  imageUrl: string
  tag?: string
}

export default function PropertyCard({
  id,
  title,
  location,
  price,
  beds,
  baths,
  area,
  imageUrl,
  tag,
}: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <div className="group rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-2xl transition duration-300 border border-border">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-muted">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />

        {/* Tag Badge */}
        {tag && (
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
            {tag}
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition"
          aria-label="Add to favorites"
        >
          <Heart size={20} className={isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-serif font-bold text-foreground mb-2">{title}</h3>

        <div className="flex items-center text-muted-foreground mb-4 gap-1">
          <MapPin size={16} />
          <span className="text-sm">{location}</span>
        </div>

        <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
          <span className="text-2xl font-bold text-primary">{price}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 text-muted-foreground">
          <div className="flex flex-col items-center">
            <Bed size={18} className="mb-1" />
            <span className="text-xs text-center">{beds} Beds</span>
          </div>
          <div className="flex flex-col items-center">
            <Bath size={18} className="mb-1" />
            <span className="text-xs text-center">{baths} Baths</span>
          </div>
          <div className="flex flex-col items-center">
            <Zap size={18} className="mb-1" />
            <span className="text-xs text-center">{area}</span>
          </div>
        </div>

        <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition">
          View Details
        </button>
      </div>
    </div>
  )
}
