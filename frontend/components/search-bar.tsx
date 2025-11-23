"use client"

import { Search, MapPin, Home, DollarSign } from "lucide-react"
import { useState } from "react"

export default function SearchBar() {
  const [location, setLocation] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [propertyType, setPropertyType] = useState("")

  const handleSearch = () => {
    console.log("[v0] Search applied:", { location, propertyType, priceRange })
    // Future: Filter properties based on these values
  }

  return (
    <section className="py-12 bg-background border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-border">
          <h2 className="text-2xl font-serif font-bold text-foreground mb-6">Find Your Dream Property</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Location */}
            <div className="flex items-center border border-border rounded-lg px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition">
              <MapPin size={20} className="text-muted-foreground mr-3" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 bg-transparent outline-none text-foreground"
              >
                <option value="">Select Location</option>
                <option value="london">London</option>
                <option value="newyork">New York</option>
                <option value="dubai">Dubai</option>
                <option value="paris">Paris</option>
                <option value="malibu">Malibu</option>
              </select>
            </div>

            {/* Property Type */}
            <div className="flex items-center border border-border rounded-lg px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition">
              <Home size={20} className="text-muted-foreground mr-3" />
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="flex-1 bg-transparent outline-none text-foreground"
              >
                <option value="">Property Type</option>
                <option value="villa">Villa</option>
                <option value="penthouse">Penthouse</option>
                <option value="mansion">Mansion</option>
                <option value="estate">Estate</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="flex items-center border border-border rounded-lg px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition">
              <DollarSign size={20} className="text-muted-foreground mr-3" />
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="flex-1 bg-transparent outline-none text-foreground"
              >
                <option value="">Price Range</option>
                <option value="1m-5m">$1M - $5M</option>
                <option value="5m-10m">$5M - $10M</option>
                <option value="10m-50m">$10M - $50M</option>
                <option value="50m+">$50M+</option>
              </select>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-primary text-primary-foreground rounded-lg px-6 py-3 hover:opacity-90 transition font-semibold flex items-center justify-center gap-2"
            >
              <Search size={20} />
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
