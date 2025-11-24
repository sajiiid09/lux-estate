"use client"
import { Star } from "lucide-react"
import { motion } from "framer-motion"
import { fadeIn, staggerContainer, textVariant } from "@/lib/motion"

interface Testimonial {
  id: number
  quote: string
  author: string
  location: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "LuxEstate made finding our dream home effortless. Their team's expertise and discretion were exceptional. Highly recommended.",
    author: "Sarah Mitchell",
    location: "London, UK",
  },
  {
    id: 2,
    quote: "The level of personalized service was outstanding. Every detail was handled with care and professionalism.",
    author: "David Chen",
    location: "New York, USA",
  },
  {
    id: 3,
    quote:
      "From initial consultation to closing, the experience was smooth and transparent. A true white-glove service.",
    author: "Isabella Rossi",
    location: "Dubai, UAE",
  },
]

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-background">
      <motion.div 
        variants={staggerContainer(0.1, 0.2)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="mb-16 text-center">
          <motion.h2 
            variants={textVariant(0.1)}
            className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4"
          >
            What Our Clients Say
          </motion.h2>
          <motion.p 
            variants={fadeIn("up", "tween", 0.2, 1)}
            className="text-lg text-muted-foreground"
          >
            Real experiences from satisfied luxury property buyers
          </motion.p>
        </div>

        <motion.div
          variants={staggerContainer(0.2, 0.1)}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={fadeIn("up", "spring", index * 0.2, 0.85)}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/65 backdrop-blur-xl rounded-xl p-8 shadow-lg hover:shadow-2xl transition border border-white/50 relative overflow-hidden"
            >
              <motion.div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/5 to-white/0"
                animate={{ opacity: [0.5, 0.85, 0.5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-lg text-foreground mb-6 leading-relaxed italic">"{testimonial.quote}"</p>

              {/* Author */}
              <div>
                <p className="font-serif font-bold text-foreground">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
