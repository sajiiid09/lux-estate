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
    slug: "oceanfront-villa-malibu",
    title: "Oceanfront Villa in Malibu",
    location: "Malibu, California",
    price: "$4,500,000",
    beds: 5,
    baths: 6,
    area: "6,200 sqft",
    imageUrl: "/oceanfront-malibu-villa.jpg",
    tag: "New",
    description:
      "A stunning modern villa perched above the Pacific with panoramic ocean views, infinity pool, and seamless indoor-outdoor living.",
    details: {
      type: "Villa",
      yearBuilt: "2021",
      lotSize: "0.6 acres",
      view: "Oceanfront",
    },
    amenities: ["Infinity pool", "Private beach access", "Home theater", "Smart home system", "Three-car garage"],
  },
  {
    slug: "modern-mediterranean-estate",
    title: "Modern Mediterranean Estate",
    location: "Côte d'Azur, France",
    price: "$12,500,000",
    beds: 6,
    baths: 7,
    area: "8,500 sqft",
    imageUrl: "/mediterranean-villa-france.jpg",
    tag: "Featured",
    description:
      "Elegant estate combining Mediterranean charm with contemporary finishes, featuring terraced gardens and breathtaking sea views.",
    details: {
      type: "Estate",
      yearBuilt: "2019",
      lotSize: "1.1 acres",
      view: "Sea view",
    },
    amenities: ["Infinity edge pool", "Wine cellar", "Guest house", "Private gym", "Security suite"],
  },
  {
    slug: "manhattan-luxury-penthouse",
    title: "Manhattan Penthouse",
    location: "New York, USA",
    price: "$25,000,000",
    beds: 4,
    baths: 5,
    area: "5,800 sqft",
    imageUrl: "/luxury-penthouse-manhattan.png",
    tag: "Exclusive",
    description:
      "Sky-high penthouse with floor-to-ceiling windows, private elevator access, and a wraparound terrace overlooking Central Park.",
    details: {
      type: "Penthouse",
      yearBuilt: "2020",
      view: "City skyline",
    },
    amenities: ["Private elevator", "Terrace with jacuzzi", "Chef's kitchen", "Concierge", "24/7 security"],
  },
  {
    slug: "dubai-waterfront-residence",
    title: "Dubai Waterfront Residence",
    location: "Dubai, UAE",
    price: "$8,750,000",
    beds: 5,
    baths: 6,
    area: "7,200 sqft",
    imageUrl: "/luxury-dubai-waterfront-apartment.jpg",
    description:
      "Contemporary waterfront home on the marina with glass façades, rooftop lounge, and private mooring for your yacht.",
    details: {
      type: "Residence",
      yearBuilt: "2018",
      view: "Marina",
    },
    amenities: ["Private dock", "Roof terrace", "Cinema room", "Spa suite", "Butler's pantry"],
  },
  {
    slug: "swiss-alpine-chalet",
    title: "Swiss Alpine Chalet",
    location: "Verbier, Switzerland",
    price: "$6,200,000",
    beds: 7,
    baths: 8,
    area: "9,100 sqft",
    imageUrl: "/luxury-alpine-chalet-switzerland.jpg",
    description:
      "Warm alpine retreat featuring timber beams, double-height great room, and ski-in/ski-out access to world-class slopes.",
    details: {
      type: "Chalet",
      yearBuilt: "2015",
      view: "Mountain",
    },
    amenities: ["Ski-in/ski-out", "Indoor pool", "Sauna", "Wine room", "Heated driveway"],
  },
  {
    slug: "mayfair-london-townhouse",
    title: "London Townhouse",
    location: "Mayfair, London",
    price: "$18,900,000",
    beds: 6,
    baths: 7,
    area: "8,900 sqft",
    imageUrl: "/luxury-townhouse-london-mayfair.jpg",
    tag: "New",
    description:
      "Georgian-inspired townhouse meticulously restored with a private garden square view, lift to all floors, and bespoke millwork.",
    details: {
      type: "Townhouse",
      yearBuilt: "2017",
      view: "Garden square",
    },
    amenities: ["Private lift", "Library", "Garden terrace", "Cinema room", "Staff quarters"],
  },
  {
    slug: "tokyo-skyline-residence",
    title: "Tokyo Skyline Residence",
    location: "Tokyo, Japan",
    price: "$7,800,000",
    beds: 4,
    baths: 4,
    area: "4,500 sqft",
    imageUrl: "/tokyo-luxury-penthouse.jpg",
    description:
      "Minimalist residence in the heart of Tokyo with panoramic skyline views, tatami lounge, and custom Italian kitchen.",
    details: {
      type: "Residence",
      yearBuilt: "2022",
      view: "City skyline",
    },
    amenities: ["Sky lounge", "Tea room", "Smart lighting", "Three balconies", "Doorman building"],
  },
  {
    slug: "sydney-harbour-villa",
    title: "Sydney Harbour Villa",
    location: "Sydney, Australia",
    price: "$9,300,000",
    beds: 5,
    baths: 6,
    area: "6,800 sqft",
    imageUrl: "/sydney-harbour-luxury-villa.jpg",
    description:
      "Architect-designed villa overlooking Sydney Harbour with an infinity pool, cascading decks, and open-plan entertainer's kitchen.",
    details: {
      type: "Villa",
      yearBuilt: "2016",
      view: "Harbour",
    },
    amenities: ["Infinity pool", "Outdoor kitchen", "Wine wall", "Home automation", "Four-car garage"],
  },
]

export const featuredProperties = properties.slice(0, 6)

export function getPropertyBySlug(slug: string) {
  return properties.find((property) => property.slug === slug)
}
