"use client"
import { CheckCircle } from "lucide-react"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

import { fadeIn, slideInLeft, slideInRight, staggerContainer, staggerSlow, textVariant } from "@/lib/motion"
import aboutImage from "@/public/properties/luxury-dubai-waterfront-apartment.jpg"

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

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const shimmer = useTransform(scrollYProgress, [0, 1], [0.35, 0.6])
  const imageParallax = useTransform(scrollYProgress, [0, 1], [0, -20])

  return (
    <section id="about" ref={containerRef} className="py-20 bg-background overflow-hidden">
      <motion.div
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12"
      >
        <div className="space-y-4 text-center">
          <motion.h2 
            variants={textVariant(0.1)}
            className="text-4xl sm:text-5xl font-serif font-bold text-foreground"
          >
            About LuxEstate
          </motion.h2>
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
            variants={slideInLeft}
            style={{ y: parallaxY }}
            className="relative h-96 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-white/20 border border-white/50 backdrop-blur-xl"
          >
            <motion.div
              className="absolute inset-0"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              style={{ backgroundImage: "linear-gradient(120deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05), rgba(255,255,255,0.2))", backgroundSize: "200% 200%", opacity: shimmer }}
            />
            <motion.img
              src={aboutImage.src}
              alt="LuxEstate team"
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ y: imageParallax }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-transparent" />
            <div className="absolute inset-0 rounded-2xl border border-white/30" />
          </motion.div>
          <motion.div
            variants={slideInRight}
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
          variants={staggerSlow}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              variants={fadeIn("up", "spring", index * 0.1, 0.9)}
              whileHover={{ y: -6, scale: 1.01 }}
              className="p-6 rounded-2xl border border-white/50 bg-white/65 backdrop-blur-xl shadow-lg hover:shadow-2xl transition"
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
    </section>
  )
}
