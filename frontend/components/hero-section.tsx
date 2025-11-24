"use client"
import Link from "next/link"
import { motion } from "framer-motion"
import { fadeIn, staggerContainer, textVariant } from "@/lib/motion"

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <motion.div 
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-2495db98dada?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div 
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto"
      >
        <motion.h1 
          variants={textVariant(0.1)}
          className="text-5xl sm:text-7xl font-serif font-bold text-white mb-6 tracking-tight"
        >
          Discover Your <span className="text-primary italic">Dream</span> Sanctuary
        </motion.h1>
        
        <motion.p 
          variants={fadeIn("up", "tween", 0.2, 1)}
          className="text-xl sm:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-light"
        >
          Exclusive properties in the world's most coveted locations. Experience luxury living redefined.
        </motion.p>
        
        <motion.div 
          variants={fadeIn("up", "tween", 0.4, 1)}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/properties"
            className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:bg-primary/90 transition duration-300 shadow-lg hover:shadow-primary/25"
          >
            Explore Properties
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-semibold text-lg hover:bg-white/20 transition duration-300"
          >
            Contact Concierge
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
          <motion.div 
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
            className="w-1 h-1 bg-white rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}
