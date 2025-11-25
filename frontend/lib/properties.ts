export type Property = {
  slug: string
  title: string
  location: string
  price: string
  beds: number
  baths: number
  area: string
  imageUrl: string
  tag?: string
  description: string
  details: {
    type: string
    yearBuilt: string
    lotSize?: string
    view?: string
  }
  amenities: string[]
}

export const properties: Property[] = [
  {
    slug: "test-property",
    title: "Test Property",
    location: "",
    price: "$100,000",
    beds: 1,
    baths: 1,
    area: "N/A",
    imageUrl: "",
    description: "",
    details: {
      type: "Property",
      yearBuilt: "2025",
    },
    amenities: [],
  },
  {
    slug: "the-modern-villa",
    title: "The Modern Villa",
    location: "Malibu, California, USA",
    price: "$12,500,000",
    beds: 5,
    baths: 6,
    area: "N/A",
    imageUrl: "/properties/mediterranean-villa-france.jpg",
    description: "An architectural masterpiece featuring floor-to-ceiling glass walls, an infinity pool overlooking the Pacific Ocean, and a private path to the beach. Includes a smart home system and a temperature-controlled wine cellar.",
    details: {
      type: "Villa",
      yearBuilt: "2025",
    },
    amenities: ["Infinity Pool", "Private Bar", "Smart House", "Winer Celler", "Home Theatre"],
  },
  {
    slug: "oceanview-glass-retreat",
    title: "OceanView Glass Retreat",
    location: "Malibu, California, USA",
    price: "$12,500,000",
    beds: 5,
    baths: 4,
    area: "N/A",
    imageUrl: "/properties/luxury-mansion-with-ocean-view.jpg",
    description: "An architectural masterpiece featuring floor-to-ceiling glass walls, an infinity pool overlooking the Pacific Ocean, and a private path to the beach. Includes a smart home system and a temperature-controlled wine cellar.",
    details: {
      type: "Retreat",
      yearBuilt: "2025",
    },
    amenities: ["Infinity Pool", "Private Beach Access", "Smart Home", "Wine Cellar", "Home Theater"],
  },
  {
    slug: "sky-garden-penthouse",
    title: "Sky Garden Penthouse",
    location: "New York, NY, USA",
    price: "$28,000,000",
    beds: 4,
    baths: 4,
    area: "N/A",
    imageUrl: "/properties/luxury-penthouse-nyc.jpg",
    description: "Located in the heart of Manhattan, this triplex penthouse offers 360-degree views of the skyline. Features a private rooftop terrace with a garden, outdoor kitchen, and jacuzzi.",
    details: {
      type: "Penthouse",
      yearBuilt: "2025",
    },
    amenities: ["Rooftop Terrace", "Jacuzzi", "Concierge", "Private Elevator", "Gym"],
  },
  {
    slug: "the-heritage-manor",
    title: "The Heritage Manor",
    location: "Cotswolds, UK",
    price: "$8,500,000",
    beds: 12,
    baths: 10,
    area: "N/A",
    imageUrl: "/properties/luxury-townhouse-london-mayfair.jpg",
    description: "A restored 19th-century estate sitting on 50 acres of manicured gardens. Perfect for an exclusive retreat or a private residence. Features horse stables, a guest house, and a ballroom.",
    details: {
      type: "Manor",
      yearBuilt: "2025",
    },
    amenities: ["Stables", "Guest House", "Ballroom", "Tennis Court", "Library", "Wine Celler"],
  },
  {
    slug: "aspen-winter-lodge",
    title: "Aspen Winter Lodge",
    location: "Aspen, Colorado, USA",
    price: "$18,500,000",
    beds: 7,
    baths: 6,
    area: "N/A",
    imageUrl: "/properties/luxury-alpine-chalet-switzerland.jpg",
    description: "A cozy yet luxurious ski-in/ski-out chalet nestled in the mountains. Features vaulted timber ceilings, a massive stone fireplace, and a heated outdoor terrace. Perfect for winter getaways.",
    details: {
      type: "Lodge",
      yearBuilt: "2025",
    },
    amenities: ["Ski-in/Ski-out", "Hot Tub", "Stone Fireplace", "Heated Floors", "Game Room", "Montain View"],
  },
  {
    slug: "vibe-coder-open-workspace",
    title: "Vibe Coder Open Workspace",
    location: "Palo Alto, California, USA",
    price: "$5,500,000",
    beds: 0,
    baths: 6,
    area: "N/A",
    imageUrl: "",
    description: "A modern, turnkey office floor designed for tech startups. Includes open-plan desks, private glass meeting pods, a fully stocked kitchen, and relaxation zones. LEED Platinum certified.",
    details: {
      type: "Workspace",
      yearBuilt: "2025",
    },
    amenities: ["Conference Rooms", "Fiber Internet", "Kitchenette", "Lounge Area", "Keycard Access"],
  },
  {
    slug: "carribean-island-parcel",
    title: "Carribean Island Parcel",
    location: "Exuma Cays, Bahamas",
    price: "$4,200,000",
    beds: 0,
    baths: 0,
    area: "N/A",
    imageUrl: "/properties/malibu-beach-sunset-california.jpg",
    description: "pristine white sand beachfront land ready for development. Valid permits for a private resort or luxury estate. Accessible only by boat or seaplane.",
    details: {
      type: "Land",
      yearBuilt: "2025",
    },
    amenities: ["Private Dock Permit", "Beachfront", "Helipad Potential", "Water Access"],
  },
  {
    slug: "historic-le-marais",
    title: "Historic Le Marais",
    location: "Paris, France",
    price: "$3,100,000",
    beds: 3,
    baths: 2,
    area: "N/A",
    imageUrl: "/properties/paris_apr.png",
    description: "An elegant 18th-century apartment combining historical charm with modern design. Features original parquet flooring, decorative moldings, and views of the Eiffel Tower from the balcony.",
    details: {
      type: "Apartment",
      yearBuilt: "2025",
    },
    amenities: ["Balcony", "Parquet Floors", "Central Location", "Concierge", "High Ceilings", "Eifel Tower View"],
  },
  {
    slug: "fifth-avenue-retail-shop",
    title: "Fifth Avenue Retail Shop",
    location: "New York, NY, USA",
    price: "$15,000,000",
    beds: 0,
    baths: 3,
    area: "N/A",
    imageUrl: "/properties/retailshop.png",
    description: "Prime ground-floor retail space in one of the world's most prestigious shopping districts. High foot traffic, expansive display windows, and double-height ceilings suitable for a luxury brand flagship.",
    details: {
      type: "Retail",
      yearBuilt: "2025",
    },
    amenities: ["Large Display Windows", "Storage Room", "Security System", "High Ceilings", "Loading Dock"],
  },
  {
    slug: "dubai-palm-jumeirah-villa",
    title: "Dubai Palm Jumeirah Villa",
    location: "Dubai, UAE",
    price: "$9,800,000",
    beds: 6,
    baths: 5,
    area: "N/A",
    imageUrl: "/properties/dubaivilla.png",
    description: "An ultra-modern villa on the iconic Palm Jumeirah. Features a private beach, contemporary Arabic architecture, and a smart home automation system controlling lighting and climate.",
    details: {
      type: "Villa",
      yearBuilt: "2025",
    },
    amenities: ["Private Beach", "Smart Home", "Pool", "Maid's Room", "Garage"],
  },
  {
    slug: "logistics-datacenter",
    title: "Logistics DataCenter",
    location: "London, UK",
    price: "$7,200,000",
    beds: 0,
    baths: 5,
    area: "N/A",
    imageUrl: "/properties/warehouse_retail.png",
    description: "Description: Massive industrial space located near the international airport. Features 30-foot clearance heights, multiple loading bays, and administrative offices. Ideal for e-commerce distribution.",
    details: {
      type: "Industrial",
      yearBuilt: "2025",
    },
    amenities: ["Loading Bays", "High Clearance", "3-Phase Power", "Office Space", "Parking Lot"],
  },
  {
    slug: "tuscan-vineyard",
    title: "Tuscan Vineyard",
    location: "Napa Valley, California, USA",
    price: "$14,500,000",
    beds: 7,
    baths: 8,
    area: "N/A",
    imageUrl: "/properties/luxury-mediterranean-villa.jpg",
    description: "A sprawling 20-acre estate in the heart of Napa Valley. Features an active private vineyard, a stone-built main residence, a separate guest casita, and a temperature-controlled wine cave for storage and tastings.",
    details: {
      type: "Vineyard",
      yearBuilt: "2025",
    },
    amenities: ["Private Vineyard", "Wine Cave", "Guest House", "Pool", "Outdoor Kitchen"],
  },
  {
    slug: "soho-artist-loft",
    title: "Soho Artist Loft",
    location: "New York, NY, USA",
    price: "$4,200,000",
    beds: 0,
    baths: 4,
    area: "N/A",
    imageUrl: "/properties/ofiice3.png",
    description: "A converted industrial loft in Soho perfect for creative agencies. Features exposed brick walls, original cast-iron columns, massive arched windows, and 14-foot ceilings. Open layout with a communal kitchen.",
    details: {
      type: "Loft",
      yearBuilt: "2025",
    },
    amenities: ["Exposed Brick", "High Ceilings", "Freight Elevator", "Open Layout", "Natural Light"],
  },
  {
    slug: "montana-big-sky",
    title: "Montana Big Sky",
    location: "Bozeman, Montana, USA",
    price: "$9,800,000",
    beds: 3,
    baths: 2,
    area: "N/A",
    imageUrl: "/properties/mountain2.png",
    description: "500 acres of prime ranch land with sweeping views of the Rocky Mountains. Includes water rights, a river running through the property, and rolling pastures suitable for livestock or a private retreat.",
    details: {
      type: "Ranch",
      yearBuilt: "2025",
    },
    amenities: ["River Access", "Water Rights", "Mountain Views", "Pasture Land", "Hunting Rights"],
  },
  {
    slug: "como-contemporary",
    title: "Como Contemporary",
    location: "New York, NY, USA",
    price: "$3,100,000",
    beds: 2,
    baths: 2,
    area: "N/A",
    imageUrl: "/properties/luxury-dubai-waterfront-apartment.jpg",
    description: "An elegant 18th-century apartment combining historical charm with modern design. Features original parquet flooring, decorative moldings, and views of the Eiffel Tower from the balcony.",
    details: {
      type: "Apartment",
      yearBuilt: "2025",
    },
    amenities: ["Balcony", "Parquet Floors", "Central Location", "Concierge", "High Ceilings"],
  },
]

export const featuredProperties = properties.slice(0, 6)

export function getPropertyBySlug(slug: string) {
  return properties.find((property) => property.slug === slug)
}
