"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import { Bath, Bed, MapPin, Zap } from "lucide-react"
import api from "@/lib/api"
import PropertyCard from "@/components/property-card"
import { useAuth } from "@/context/AuthContext"

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
  
  // Booking state
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState("")
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleBookNow = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/properties/${params.slug}`)
      return
    }

    if (!property) return

    setBookingLoading(true)
    setBookingError("")

    try {
      const response = await api.post("/api/bookings/create/", {
        property_id: property.id
      })
      // Redirect to payment page with booking ID
      router.push(`/payment?booking_id=${response.data.id}`)
    } catch (err: any) {
      console.error("Booking failed", err)
      setBookingError(err.response?.data?.detail || "Failed to create booking. Please try again.")
    } finally {
      setBookingLoading(false)
    }
  }

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
              <div className="flex justify-between items-start">
                <h1 className="text-4xl font-serif font-bold text-foreground">{property.title}</h1>
                <span className={`px-4 py-1 rounded-full text-sm font-semibold uppercase tracking-wide ${property.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {property.is_available ? 'Available' : 'Booked'}
                </span>
              </div>
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
                Ready to experience this property? Book it now to secure your reservation.
              </p>
              
              {property.is_available ? (
                <button
                  onClick={handleBookNow}
                  disabled={bookingLoading}
                  className="w-full inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/>
                      Processing...
                    </span>
                  ) : (
                    "Book Now"
                  )}
                </button>
              ) : (
                <div className="w-full px-8 py-3 bg-gray-200 text-gray-500 rounded-lg font-semibold text-center cursor-not-allowed border border-gray-300">
                  Not Available
                </div>
              )}
              
              {bookingError && (
                <p className="text-sm text-red-500 text-center mt-2">{bookingError}</p>
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
