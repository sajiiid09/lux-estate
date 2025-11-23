"use client"
import PropertyCard from "./property-card"

interface Property {
  id: number
  title: string
  location: string
  price: string
  beds: number
  baths: number
  area: string
  imageUrl: string
  tag?: string
}

const featuredProperties: Property[] = [
  {
    id: 1,
    title: "Oceanfront Villa in Malibu",
    location: "Malibu, California",
    price: "$4,500,000",
    beds: 5,
    baths: 6,
    area: "6,200 sqft",
    imageUrl: "/oceanfront-malibu-villa.jpg",
    tag: "New",
  },
  {
    id: 2,
    title: "Modern Mediterranean Estate",
    location: "Côte d'Azur, France",
    price: "$12,500,000",
    beds: 6,
    baths: 7,
    area: "8,500 sqft",
    imageUrl: "/mediterranean-villa-france.jpg",
    tag: "Featured",
  },
  {
    id: 3,
    title: "Manhattan Penthouse",
    location: "New York, USA",
    price: "$25,000,000",
    beds: 4,
    baths: 5,
    area: "5,800 sqft",
    imageUrl: "/luxury-penthouse-manhattan.png",
    tag: "Exclusive",
  },
  {
    id: 4,
    title: "Dubai Waterfront Residence",
    location: "Dubai, UAE",
    price: "$8,750,000",
    beds: 5,
    baths: 6,
    area: "7,200 sqft",
    imageUrl: "/luxury-dubai-waterfront-apartment.jpg",
  },
  {
    id: 5,
    title: "Swiss Alpine Chalet",
    location: "Verbier, Switzerland",
    price: "$6,200,000",
    beds: 7,
    baths: 8,
    area: "9,100 sqft",
    imageUrl: "/luxury-alpine-chalet-switzerland.jpg",
  },
  {
    id: 6,
    title: "London Townhouse",
    location: "Mayfair, London",
    price: "$18,900,000",
    beds: 6,
    baths: 7,
    area: "8,900 sqft",
    imageUrl: "/luxury-townhouse-london-mayfair.jpg",
    tag: "New",
  },
]

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
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition">
            View All Properties
          </button>
        </div>
      </div>
    </section>
  )
}
