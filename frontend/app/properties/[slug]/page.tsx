import Link from "next/link"
import { notFound } from "next/navigation"
import { Bath, Bed, MapPin, Zap } from "lucide-react"

import { getPropertyBySlug } from "@/lib/properties"

interface PropertyPageProps {
  params: { slug: string }
}

export default function PropertyDetailPage({ params }: PropertyPageProps) {
  const property = getPropertyBySlug(params.slug)

  if (!property) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="relative h-[420px] rounded-2xl overflow-hidden shadow-xl">
          <img src={property.imageUrl || "/placeholder.svg"} alt={property.title} className="w-full h-full object-cover" />
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
                <span>{property.beds} Beds</span>
              </div>
              <div className="flex items-center gap-2">
                <Bath size={18} />
                <span>{property.baths} Baths</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={18} />
                <span>{property.area}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Type:</span>
                <span>{property.details.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Year:</span>
                <span>{property.details.yearBuilt}</span>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-border bg-white shadow-sm space-y-3">
              <h2 className="text-2xl font-serif font-bold text-foreground">Overview</h2>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-white shadow-sm space-y-4">
              <h2 className="text-2xl font-serif font-bold text-foreground">Amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-muted-foreground">
                {property.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div id="book-now" className="p-6 rounded-xl border border-dashed border-primary bg-primary/5 shadow-sm space-y-4">
              <h2 className="text-2xl font-serif font-bold text-foreground">Book a Private Showing</h2>
              <p className="text-muted-foreground">
                Share your details and our concierge team will schedule a private tour tailored to your availability.
              </p>
              <Link
                href={`/contact?property=${property.slug}`}
                className="inline-block px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
              >
                Book Now
              </Link>
            </div>
          </div>

          <aside className="p-6 rounded-xl border border-border bg-white shadow-sm space-y-6">
            <div className="space-y-2">
              <span className="text-sm uppercase tracking-wide text-muted-foreground">Listing Price</span>
              <div className="text-3xl font-bold text-primary">{property.price}</div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Property Details</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Type: {property.details.type}</li>
                <li>Year Built: {property.details.yearBuilt}</li>
                {property.details.lotSize && <li>Lot Size: {property.details.lotSize}</li>}
                {property.details.view && <li>View: {property.details.view}</li>}
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
      </div>
    </div>
  )
}
