"use client"
import Link from "next/link"

import { featuredProperties } from "@/lib/properties"
import PropertyCard from "./property-card"

export default function FeaturedProperties() {
  return (
    <section id="featured-properties" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">Featured Properties</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Handpicked selections of the finest luxury real estate from around the world
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.slug} {...property} />
          ))}
        </div>

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
