"use client"
import { CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { fadeIn, staggerContainer, textVariant } from "@/lib/motion"

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
      <motion.div 
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12"
      >
        <div className="space-y-4 text-center">
          <motion.h1 
            variants={textVariant(0.1)}
            className="text-4xl sm:text-5xl font-serif font-bold text-foreground"
          >
            About LuxEstate
          </motion.h1>
          <motion.p 
            variants={fadeIn("up", "tween", 0.2, 1)}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            With over 25 years dedicated to luxury real estate, LuxEstate is the trusted partner for discerning buyers, sellers,
            and investors seeking remarkable properties worldwide.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            variants={fadeIn("right", "tween", 0.3, 1)}
            className="relative h-96 rounded-lg overflow-hidden shadow-lg"
          >
            <motion.img 
              src="/luxury-real-estate-office-modern.jpg" 
              alt="LuxEstate team" 
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </motion.div>
          <motion.div 
            variants={fadeIn("left", "tween", 0.4, 1)}
            className="space-y-6 text-muted-foreground"
          >
            <p className="text-lg leading-relaxed">
              Our team of expert advisors blends deep market knowledge with discreet, bespoke service. From turnkey villas to
              skyline penthouses, every listing is vetted for craftsmanship, location, and long-term value.
            </p>
            <p className="text-lg leading-relaxed">
              We coordinate every detail—from private viewings and legal due diligence to relocation and design introductions—so
              you can focus on enjoying the journey to your next address.
            </p>
          </motion.div>
        </div>

        <motion.div 
          variants={staggerContainer(0.2, 0.1)}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {pillars.map((pillar, index) => (
            <motion.div 
              key={pillar.title} 
              variants={fadeIn("up", "spring", index * 0.1, 0.75)}
              whileHover={{ y: -5 }}
              className="p-6 rounded-lg border border-border bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex gap-3 items-start mb-3">
                <CheckCircle size={24} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{pillar.title}</h3>
                  <p className="text-muted-foreground mt-1">{pillar.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
