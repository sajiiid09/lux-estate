import { CheckCircle } from "lucide-react"

const pillars = [
  {
    title: "Curated Portfolio",
    description: "Hand-selected residences across the world's most coveted neighborhoods and resort destinations.",
  },
  {
    title: "Global Network",
    description: "Trusted relationships with owners, developers, and partners in every major luxury market.",
  },
  {
    title: "Discretion & Privacy",
    description: "White-glove representation with complete confidentiality for high-profile clientele.",
  },
  {
    title: "Personalized Advisory",
    description: "Tailored search, investment analysis, and concierge-level support from enquiry to closing and beyond.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">About LuxEstate</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            With over 25 years dedicated to luxury real estate, LuxEstate is the trusted partner for discerning buyers, sellers,
            and investors seeking remarkable properties worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
            <img src="/luxury-real-estate-office-modern.jpg" alt="LuxEstate team" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-6 text-muted-foreground">
            <p className="text-lg leading-relaxed">
              Our team of expert advisors blends deep market knowledge with discreet, bespoke service. From turnkey villas to
              skyline penthouses, every listing is vetted for craftsmanship, location, and long-term value.
            </p>
            <p className="text-lg leading-relaxed">
              We coordinate every detail—from private viewings and legal due diligence to relocation and design introductions—so
              you can focus on enjoying the journey to your next address.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="p-6 rounded-lg border border-border bg-white shadow-sm">
              <div className="flex gap-3 items-start mb-3">
                <CheckCircle size={24} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{pillar.title}</h3>
                  <p className="text-muted-foreground mt-1">{pillar.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
