"use client"

import Link from "next/link"

export default function CTASection() {
  return (
    <section id="cta-section" className="py-20 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-serif font-bold mb-6">Ready to Find Your Next Home?</h2>
        <p className="text-lg text-primary-foreground/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Speak with our luxury property specialists today. Let's discover the perfect property for you.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="px-8 py-4 bg-primary-foreground text-primary font-semibold rounded-lg hover:opacity-90 transition"
          >
            Request a Call Back
          </Link>
          <Link
            href="/contact"
            className="px-8 py-4 border-2 border-primary-foreground text-primary-foreground rounded-lg hover:bg-primary-foreground/10 transition font-semibold"
          >
            Schedule a Consultation
          </Link>
        </div>
      </div>
    </section>
  )
}
