"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { fadeIn, staggerContainer } from "@/lib/motion"

export default function CTASection() {
  return (
    <section id="cta-section" className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-primary via-primary/80 to-primary"
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <motion.h2
          variants={fadeIn("up", "tween", 0.1, 1)}
          className="text-4xl sm:text-5xl font-serif font-bold mb-6"
        >
          Ready to Find Your Dream Home?
        </motion.h2>
        <motion.p
          variants={fadeIn("up", "tween", 0.2, 1)}
          className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto"
        >
          Let our expert team guide you through the journey of acquiring your perfect luxury property.
        </motion.p>
        <motion.div variants={fadeIn("up", "tween", 0.3, 1)}>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 bg-white text-primary font-bold rounded-full text-lg hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Contact Us Today
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
