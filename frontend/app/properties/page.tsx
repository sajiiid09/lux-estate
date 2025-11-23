"use client"

import { useState, useEffect } from "react"
import PropertyCard from "@/components/property-card"
import api from "@/lib/api"

interface Category {
  id: number
  name: string
  slug: string
}

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

export default function PropertiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/categories/")
        setCategories(response.data)
      } catch (err) {
        console.error("Failed to fetch categories", err)
        // Optional: Set a UI error state for categories if critical
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      setError("")
      try {
        // Backend uses 'category' for filtering, not 'category_id'
        const params = selectedCategory ? { category: selectedCategory } : {}
        const response = await api.get("/api/properties/", { params })
        setProperties(response.data)
      } catch (err) {
        setError("Failed to load properties. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [selectedCategory])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-3">Luxury Properties</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Explore our curated portfolio of villas, penthouses, and residences around the globe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 p-6 rounded-xl border border-border bg-white shadow-sm space-y-4 h-fit">
            <h2 className="text-xl font-semibold text-foreground">Categories</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                  selectedCategory === null
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </aside>

          <section className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-10">
                {error}
                <button 
                  onClick={() => window.location.reload()} 
                  className="block mx-auto mt-4 text-primary hover:underline"
                >
                  Retry
                </button>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No properties found in this category.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </section>
        </div>
      </div>
    </div>
  )
}
