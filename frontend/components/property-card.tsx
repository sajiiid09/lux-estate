"use client"
import Link from "next/link"
import { useState } from "react"
import { Bath, Bed, Heart, MapPin, Zap } from "lucide-react"
import { motion } from "framer-motion"

import { useIsMobile } from "@/hooks/use-mobile"
import { resolveMediaUrl } from "@/lib/utils"

interface PropertyCardProps {
  id: number
  slug: string
  title: string
  location: string
  price: string
  beds?: number
  baths?: number
  area?: string | null
  imageUrl?: string | null
  tag?: string
  isAvailable?: boolean
  detailHref?: string
  showBookButton?: boolean
  onBook?: (propertyId: number, slug: string) => void
  bookingLoading?: boolean
}

export default function PropertyCard({
  id,
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
  showBookButton = true,
  isAvailable = true,
  onBook,
  bookingLoading,
}: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const isMobile = useIsMobile()

  const hoverScale = isMobile ? 1.01 : 1.03
  const hoverShadow = isMobile ? "0 10px 32px rgba(0,0,0,0.12)" : "0 18px 52px rgba(0,0,0,0.16)"

  const detailLink = detailHref || `/properties/${slug}`
  const bookingDisabled = !isAvailable || bookingLoading
  const areaLabel = area || "N/A"
  const bedsLabel = typeof beds === "number" ? beds : "—"
  const bathsLabel = typeof baths === "number" ? baths : "—"
  const resolvedImage = resolveMediaUrl(imageUrl) || "/placeholder.svg"

  return (
    <motion.div
      variants={{ rest: { scale: 1, boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }, hover: { scale: hoverScale, y: -6, boxShadow: hoverShadow } }}
      initial="rest"
      whileHover="hover"
      animate="rest"
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-2xl overflow-hidden border border-white/50 bg-white/60 backdrop-blur-xl shadow-xl transition-all duration-500"
    >
      <div className="relative h-64 overflow-hidden bg-muted">
        <motion.img
          src={resolvedImage}
          alt={title}
          className="w-full h-full object-cover"
          whileHover={{ scale: isMobile ? 1.02 : 1.12 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 0.85 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />

        {tag && (
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
            {tag}
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition"
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

        <div className="flex items-center justify-between pb-4 border-b border-border/70">
          <span className="text-2xl font-bold text-primary">{price}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 text-muted-foreground">
          <div className="flex flex-col items-center">
            <Bed size={18} className="mb-1" />
            <span className="text-xs text-center">{bedsLabel} Beds</span>
          </div>
          <div className="flex flex-col items-center">
            <Bath size={18} className="mb-1" />
            <span className="text-xs text-center">{bathsLabel} Baths</span>
          </div>
          <div className="flex flex-col items-center">
            <Zap size={18} className="mb-1" />
            <span className="text-xs text-center">{areaLabel}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={detailLink}
            className="flex-1 text-center py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-95 transition shadow-lg shadow-primary/15"
          >
            View Details
          </Link>
          {showBookButton && (
            onBook ? (
              <button
                onClick={() => onBook(id, slug)}
                disabled={bookingDisabled}
                className="flex-1 text-center py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition shadow-inner disabled:cursor-not-allowed disabled:opacity-60"
              >
                {bookingLoading ? "Booking..." : isAvailable ? "Book Now" : "Not Available"}
              </button>
            ) : (
              <Link
                href={`${detailLink}#book-now`}
                className="flex-1 text-center py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition shadow-inner"
              >
                Book Now
              </Link>
            )
          )}
        </div>
      </div>
    </motion.div>
  )
}
