"use client"

import { Search, MapPin, Home, DollarSign } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

import { fadeIn, smoothOpacity, staggerContainer } from "@/lib/motion"

export default function SearchBar() {
  const [location, setLocation] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [propertyType, setPropertyType] = useState("")

  const handleSearch = () => {
    console.log("[v0] Search applied:", { location, propertyType, priceRange })
    // Future: Filter properties based on these values
  }

  return (
    <motion.section
      variants={staggerContainer(0.12, 0.1)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="py-12 bg-background border-b border-border"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeIn("up", "tween", 0, 0.8)}
          className="relative overflow-hidden rounded-xl border border-white/50 bg-white/60 backdrop-blur-xl shadow-xl"
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/50 via-white/40 to-white/30"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative p-6 sm:p-8">
            <motion.h2 variants={smoothOpacity} className="text-2xl font-serif font-bold text-foreground mb-6">
              Find Your Dream Property
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location */}
              <motion.div
                variants={fadeIn("up", "tween", 0.05, 0.7)}
                className="flex items-center rounded-lg px-4 py-3 border border-border/70 bg-white/50 backdrop-blur focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25 transition"
              >
                <MapPin size={20} className="text-muted-foreground mr-3" />
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-foreground"
                >
                  <option value="">Select Location</option>
                  <option value="london">London</option>
                  <option value="newyork">New York</option>
                  <option value="dubai">Dubai</option>
                  <option value="paris">Paris</option>
                  <option value="malibu">Malibu</option>
                </select>
              </motion.div>

              {/* Property Type */}
              <motion.div
                variants={fadeIn("up", "tween", 0.1, 0.7)}
                className="flex items-center rounded-lg px-4 py-3 border border-border/70 bg-white/50 backdrop-blur focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25 transition"
              >
                <Home size={20} className="text-muted-foreground mr-3" />
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-foreground"
                >
                  <option value="">Property Type</option>
                  <option value="villa">Villa</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="mansion">Mansion</option>
                  <option value="estate">Estate</option>
                </select>
              </motion.div>

              {/* Price Range */}
              <motion.div
                variants={fadeIn("up", "tween", 0.15, 0.7)}
                className="flex items-center rounded-lg px-4 py-3 border border-border/70 bg-white/50 backdrop-blur focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25 transition"
              >
                <DollarSign size={20} className="text-muted-foreground mr-3" />
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-foreground"
                >
                  <option value="">Price Range</option>
                  <option value="1m-5m">$1M - $5M</option>
                  <option value="5m-10m">$5M - $10M</option>
                  <option value="10m-50m">$10M - $50M</option>
                  <option value="50m+">$50M+</option>
                </select>
              </motion.div>

              {/* Search Button */}
              <motion.button
                variants={fadeIn("up", "tween", 0.2, 0.7)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSearch}
                className="relative overflow-hidden bg-primary text-primary-foreground rounded-lg px-6 py-3 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition"
              >
                <motion.span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10"
                  animate={{ x: ["-20%", "120%", "120%"], opacity: [0, 0.3, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                />
                <Search size={20} />
                <span>Search</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
