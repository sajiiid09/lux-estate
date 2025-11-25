import HeroSection from "@/components/hero-section"
import SearchBar from "@/components/search-bar"
import FeaturedProperties from "@/components/featured-properties"
import DestinationsSection from "@/components/destinations-section"
import TestimonialsSection from "@/components/testimonials-section"
import CTASection from "@/components/cta-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <HeroSection />
        <SearchBar />
        <FeaturedProperties />
        <DestinationsSection />
        <TestimonialsSection />
        <CTASection />
      </main>
    </div>
  )
}
