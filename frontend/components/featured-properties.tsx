"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import api from "@/lib/api"
import PropertyCard from "./property-card"

interface Property {
  id: number
  title: string
  slug: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  image: string | null
  category: number
  amenities: string[]
}

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProperties = async () => {
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

  return (
    <section id="featured-properties" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">Featured Properties</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked selections of the finest luxury real estate from around the world
          </p>
        </div>

        {loading ? (
           <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
           </div>
        ) : error ? (
           <div className="text-center text-red-500 py-10">
             {error}
           </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
                <PropertyCard 
                key={property.slug} 
                {...property}
                price={`$${Number(property.price).toLocaleString()}`}
                beds={property.bedrooms}
                baths={property.bathrooms}
                imageUrl={property.image || "/placeholder.svg"}
                area={`${property.area} sqft`}
                description=""
                details={{ type: "Residence", yearBuilt: "N/A" }}
                amenities={property.amenities || []}
                />
            ))}
            </div>
        )}

        <div className="text-center mt-16">
          <Link
            href="/properties"
            className="inline-block px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition"
          >
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  )
}
