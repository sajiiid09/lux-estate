"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import api from "@/lib/api"
import PropertyCard from "./property-card"
import { fadeIn, staggerContainer, textVariant } from "@/lib/motion"
import { useBooking } from "@/hooks/use-booking"
import { resolveMediaUrl } from "@/lib/utils"

interface Property {
  id: number
  title: string
  slug: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area?: number | null
  image: string | null
  image_url?: string | null
  category: number
  amenities: string[]
  is_available: boolean
}

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { createBooking, loadingId, error: bookingError, setError: setBookingError } = useBooking()

  useEffect(() => {
    const fetchProperties = async () => {
      setBookingError("")
      try {
        const response = await api.get("/api/properties/")
        // Take first 3 properties as featured for now
        setProperties(response.data.slice(0, 3))
      } catch (err) {
        console.error("Failed to fetch featured properties", err)
        setError("Failed to load featured properties.")
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [])

  const handleBookNow = (property: Property) => {
    if (!property.is_available) return
    createBooking(property.id, `/properties/${property.slug}`)
  }

  return (
    <section id="featured-properties" className="py-20 bg-background">
      <motion.div 
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-12 text-center">
          <motion.h2 
            variants={textVariant(0.1)}
            className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4"
          >
            Featured Properties
          </motion.h2>
          <motion.p 
            variants={fadeIn("up", "tween", 0.2, 1)}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Handpicked selections of the finest luxury real estate from around the world
          </motion.p>
        </div>

        {bookingError && (
          <div className="text-center text-sm text-red-500 mb-4">{bookingError}</div>
        )}
        {loading ? (
           <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
           </div>
        ) : error ? (
           <div className="text-center text-red-500 py-10">
             {error}
           </div>
        ) : (
            <motion.div 
              variants={staggerContainer(0.2, 0.1)}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
            {properties.map((property, index) => (
                <motion.div
                  key={property.slug}
                  variants={fadeIn("up", "spring", index * 0.1, 0.75)}
                >
                  <PropertyCard
                    {...property}
                    price={`$${Number(property.price).toLocaleString()}`}
                    beds={property.bedrooms}
                    baths={property.bathrooms}
                    imageUrl={resolveMediaUrl(property.image_url || property.image) || "/placeholder.svg"}
                    area={property.area ? `${property.area} sqft` : null}
                    isAvailable={property.is_available}
                    onBook={() => handleBookNow(property)}
                    bookingLoading={loadingId === property.id}
                  />
                </motion.div>
            ))}
            </motion.div>
        )}

        <motion.div 
          variants={fadeIn("up", "tween", 0.4, 1)}
          className="text-center mt-16"
        >
          <Link
            href="/properties"
            className="inline-block px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition"
          >
            View All Properties
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
