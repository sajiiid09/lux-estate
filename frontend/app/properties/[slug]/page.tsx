"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Bath, Bed, MapPin, Zap } from "lucide-react"
import api from "@/lib/api"
import PropertyCard from "@/components/property-card"

interface PropertyDetail {
  id: number
  title: string
  slug: string
  price: number
  location: string
  description: string
  bedrooms: number
  bathrooms: number
  area: number
  amenities: string[]
  image: string | null
  category: number
  is_available: boolean
}

interface PropertyPageProps {
  params: { slug: string }
}

export default function PropertyDetailPage({ params }: PropertyPageProps) {
  const [property, setProperty] = useState<PropertyDetail | null>(null)
  const [similarProperties, setSimilarProperties] = useState<PropertyDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/api/properties/${params.slug}/`)
        setProperty(response.data)
        
        // Fetch similar properties
        if (response.data.category) {
            try {
                const similarRes = await api.get(`/api/properties/recommended/?category_id=${response.data.category}`)
                // Filter out current property
                setSimilarProperties(similarRes.data.filter((p: any) => p.id !== response.data.id).slice(0, 3))
            } catch (simErr) {
                console.error("Failed to fetch similar properties", simErr)
            }
        }

      } catch (err: any) {
        console.error("Failed to fetch property", err)
        if (err.response && err.response.status === 404) {
          setError("not-found")
        } else {
          setError("Failed to load property details.")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error === "not-found") {
    return notFound()
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-red-500 mb-4">{error || "Something went wrong"}</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    )
  }

  const primaryImage = property.image || "/placeholder.svg"

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-xl">
          <img src={primaryImage} alt={property.title} className="w-full h-full object-cover" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-serif font-bold text-foreground">{property.title}</h1>
              <div className="flex items-center text-muted-foreground gap-2">
                <MapPin size={18} />
                <span>{property.location}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Bed size={18} />
                <span>{property.bedrooms} Beds</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath size={18} />
                <span>{property.bathrooms} Baths</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={18} />
                <span>{property.area} sqft</span>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border bg-white shadow-sm space-y-3">
              <h2 className="text-2xl font-serif font-bold text-foreground">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{property.description || "No description available."}</p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-white shadow-sm space-y-4">
              <h2 className="text-2xl font-serif font-bold text-foreground">Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-muted-foreground">
                {property.amenities && property.amenities.length > 0 ? (
                   property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                      <span>{amenity}</span>
                    </div>
                  ))
                ) : (
                  <p>No amenities listed.</p>
                )}
              </div>
            </div>

            <div id="book-now" className="p-6 rounded-xl border border-dashed border-primary bg-primary/5 shadow-sm space-y-4">
              <h2 className="text-2xl font-serif font-bold text-foreground">Book a Private Showing</h2>
              <p className="text-muted-foreground">
                Share your details and our concierge team will schedule a private tour tailored to your availability.
              </p>
              {property.is_available ? (
                <Link
                  href={`/contact?property=${property.slug}`}
                  className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Book Now
                </Link>
              ) : (
                <button disabled className="px-8 py-3 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed">
                  Unavailable
                </button>
              )}
            </div>
          </div>

          <aside className="p-6 rounded-xl border border-border bg-white shadow-sm space-y-6 h-fit">
            <div className="space-y-2">
              <span className="text-sm uppercase tracking-wide text-muted-foreground">Listing Price</span>
              <div className="text-3xl font-bold text-primary">${Number(property.price).toLocaleString()}</div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Property Details</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Bedrooms: {property.bedrooms}</li>
                <li>Bathrooms: {property.bathrooms}</li>
                <li>Area: {property.area} sqft</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Location</h3>
              <div className="h-40 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground">
                Map preview coming soon
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/properties"
                className="inline-block w-full text-center px-6 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition"
              >
                Back to Properties
              </Link>
            </div>
          </aside>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
            <div className="mt-16">
                <h2 className="text-3xl font-serif font-bold text-foreground mb-8">Similar Properties</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {similarProperties.map((prop) => (
                        <PropertyCard 
                            key={prop.slug}
                            {...prop}
                            price={`$${Number(prop.price).toLocaleString()}`}
                            beds={prop.bedrooms}
                            baths={prop.bathrooms}
                            imageUrl={prop.image || "/placeholder.svg"}
                            area={`${prop.area} sqft`}
                            description=""
                            details={{ type: "Residence", yearBuilt: "N/A" }}
                            amenities={prop.amenities || []}
                        />
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  )
}
