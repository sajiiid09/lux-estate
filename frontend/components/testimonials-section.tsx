import { Star } from "lucide-react"

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">What Our Clients Say</h2>
          <p className="text-lg text-muted-foreground">Real experiences from satisfied luxury property buyers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition border border-border"
            >
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
