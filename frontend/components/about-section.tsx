import { CheckCircle } from "lucide-react"

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
            <img src="/luxury-real-estate-office-modern.jpg" alt="LuxEstate team" className="w-full h-full object-cover" />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-4xl font-serif font-bold text-foreground mb-6">About LuxEstate</h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              With over 25 years of experience in luxury real estate, LuxEstate has established itself as the premier
              destination for discerning buyers and sellers worldwide.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our team of expert agents specializes in exclusive properties, providing white-glove service and
              unparalleled market knowledge to ensure seamless transactions.
            </p>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle size={24} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Curated Portfolio</h3>
                  <p className="text-muted-foreground">
                    Hand-selected properties from the world's most coveted locations
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle size={24} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Global Network</h3>
                  <p className="text-muted-foreground">
                    Access to exclusive listings across all major international markets
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle size={24} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Discretion Guaranteed</h3>
                  <p className="text-muted-foreground">
                    Complete confidentiality and privacy for all high-profile transactions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
