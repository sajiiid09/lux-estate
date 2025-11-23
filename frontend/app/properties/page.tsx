"use client"

import { useState } from "react"

import PropertyCard from "@/components/property-card"
import { properties } from "@/lib/properties"

const categories = ["All", "Villas", "Apartments", "Penthouses", "Beachfront", "Mountain", "City"]

export default function PropertiesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-3">Luxury Properties</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Explore our curated portfolio of villas, penthouses, and residences around the globe. Filters will be available soon
            for tailored browsing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 p-6 rounded-xl border border-border bg-white shadow-sm space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </aside>

          <section className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.slug} {...property} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
