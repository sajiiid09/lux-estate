"use client"
import Link from "next/link"
import { useState } from "react"
import { Bath, Bed, Heart, MapPin, Zap } from "lucide-react"
import { motion } from "framer-motion"

import type { Property } from "@/lib/properties"

interface PropertyCardProps extends Property {
  detailHref?: string
  bookHref?: string
  showBookButton?: boolean
}

export default function PropertyCard({
  slug,
  title,
  location,
  price,
  beds,
  baths,
  area,
  imageUrl,
  tag,
  detailHref,
  bookHref,
  showBookButton = true,
}: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)

  const detailLink = detailHref || `/properties/${slug}`
  const bookLink = bookHref || `/properties/${slug}#book-now`

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group rounded-lg overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-border"
    >
      <div className="relative h-64 overflow-hidden bg-muted">
        <motion.img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
        />

        {tag && (
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
            {tag}
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition"
          aria-label="Add to favorites"
        >
          <Heart size={20} className={isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </motion.button>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-serif font-bold text-foreground mb-2">{title}</h3>
          <div className="flex items-center text-muted-foreground gap-1">
            <MapPin size={16} />
            <span className="text-sm">{location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-border">
          <span className="text-2xl font-bold text-primary">{price}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 text-muted-foreground">
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

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={detailLink}
            className="flex-1 text-center py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
          >
            View Details
          </Link>
          {showBookButton && (
            <Link
              href={bookLink}
              className="flex-1 text-center py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition"
            >
              Book Now
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  )
}
