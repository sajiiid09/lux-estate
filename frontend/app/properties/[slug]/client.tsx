"use client"

import { useState } from "react"
import Link from "next/link"
import { Bath, Bed, MapPin, Zap, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { useBooking } from "@/hooks/use-booking"
import PropertyCard from "@/components/property-card"
import { getPropertyImage } from "@/lib/property-images"
import { resolveMediaUrl } from "@/lib/utils"

interface PropertyDetail {
  id: number
  title: string
  slug: string
  price: number
  location: string
  description: string
  bedrooms: number
  bathrooms: number
  area?: number | null
  amenities: string[]
  image: string | null
  image_url?: string | null
  category: number
  is_available: boolean
}

interface PropertyClientProps {
  property: PropertyDetail
  similarProperties: PropertyDetail[]
}

export default function PropertyClient({ property, similarProperties }: PropertyClientProps) {
  const { createBooking, loadingId, error: bookingError } = useBooking()
  const [isFavorited, setIsFavorited] = useState(false)

  const fallbackImage = getPropertyImage(property.slug) || `/properties/${property.slug}.jpg`
  const primaryImage = resolveMediaUrl(property.image_url || property.image) || fallbackImage || "/properties/placeholder.jpg"
  const areaLabel = property.area ? `${property.area} sqft` : "N/A"

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Image Section */}
        <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-xl group">
          <img src={primaryImage} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
          
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="absolute top-6 right-6 p-3 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition hover:scale-110 active:scale-95"
            aria-label="Add to favorites"
          >
            <Heart size={24} className={isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                  <h1 className="text-4xl font-serif font-bold text-foreground leading-tight">{property.title}</h1>
                  <div className="flex items-center text-muted-foreground gap-2 mt-2">
                    <MapPin size={18} className="text-primary" />
                    <span className="text-lg">{property.location}</span>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide self-start ${property.is_available ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                  {property.is_available ? 'Available' : 'Booked'}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 p-6 bg-white rounded-xl border border-border shadow-sm">
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <Bed size={28} className="text-primary mb-2" />
                <span className="text-2xl font-bold text-foreground">{property.bedrooms}</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Bedrooms</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 text-center border-l border-r border-border/50">
                <Bath size={28} className="text-primary mb-2" />
                <span className="text-2xl font-bold text-foreground">{property.bathrooms}</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Bathrooms</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 text-center">
                <Zap size={28} className="text-primary mb-2" />
                <span className="text-2xl font-bold text-foreground">{areaLabel}</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">Area</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-foreground">Overview</h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-muted-foreground leading-relaxed text-lg">{property.description || "No description available."}</p>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-foreground">Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.amenities && property.amenities.length > 0 ? (
                   property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                      <div className="h-2 w-2 rounded-full bg-primary shrink-0" aria-hidden />
                      <span className="text-foreground/80 font-medium">{amenity}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground italic">No amenities listed.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="p-6 rounded-2xl border border-border bg-white shadow-lg space-y-6 sticky top-24">
              <div className="space-y-1 pb-6 border-b border-border">
                <span className="text-sm uppercase tracking-wide text-muted-foreground font-semibold">Listing Price</span>
                <div className="text-4xl font-bold text-primary">${Number(property.price).toLocaleString()}</div>
              </div>

              <div id="book-now" className="space-y-4">
                <h3 className="text-xl font-serif font-bold text-foreground">Book a Viewing</h3>
                <p className="text-sm text-muted-foreground">
                  Interested in this property? Schedule a private showing today.
                </p>
                
                {property.is_available ? (
                  <button
                    onClick={() => createBooking(property.id, `/properties/${property.slug}`)}
                    disabled={loadingId === property.id}
                    className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {loadingId === property.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"/>
                        Processing...
                      </span>
                    ) : (
                      "Book Now"
                    )}
                  </button>
                ) : (
                  <div className="w-full py-4 bg-gray-100 text-gray-400 rounded-xl font-bold text-lg text-center border border-gray-200 cursor-not-allowed">
                    Currently Unavailable
                  </div>
                )}

                {bookingError && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                    {bookingError}
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Link
                  href="/properties"
                  className="block w-full text-center py-3 text-muted-foreground hover:text-primary font-medium transition-colors"
                >
                  ← Back to Properties
                </Link>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
            <div className="pt-16 border-t border-border">
                <h2 className="text-3xl font-serif font-bold text-foreground mb-8">Similar Properties</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {similarProperties.map((prop) => (
                        <PropertyCard
                            key={prop.slug}
                            {...prop}
                            price={`$${Number(prop.price).toLocaleString()}`}
                            beds={prop.bedrooms}
                            baths={prop.bathrooms}
                            imageUrl={prop.image_url || prop.image}
                            area={prop.area ? `${prop.area} sqft` : null}
                            isAvailable={prop.is_available}
                            onBook={() => createBooking(prop.id, `/properties/${prop.slug}`)}
                            bookingLoading={loadingId === prop.id}
                          />
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  )
}
