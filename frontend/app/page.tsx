import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import SearchBar from "@/components/search-bar"
import FeaturedProperties from "@/components/featured-properties"
import DestinationsSection from "@/components/destinations-section"
import TestimonialsSection from "@/components/testimonials-section"
import AboutSection from "@/components/about-section"
import CTASection from "@/components/cta-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <SearchBar />
        <FeaturedProperties />
        <DestinationsSection />
        <TestimonialsSection />
        <AboutSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
