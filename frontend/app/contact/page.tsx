"use client"

import { useState } from "react"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("Contact submission", formData)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mb-10 space-y-3">
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-foreground">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Reach out for private showings, portfolio guidance, or any questions about our luxury listings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-2 p-8 rounded-xl border border-border bg-white shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone (optional)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Message</label>
              <textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-lg border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary min-h-[140px]"
                placeholder="Tell us about the property or service you're interested in"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
            >
              Submit Inquiry
            </button>
          </form>

          <div className="p-8 rounded-xl border border-border bg-white shadow-sm space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-serif font-bold text-foreground">Direct Contacts</h2>
              <p className="text-muted-foreground">Connect with our specialists for tailored guidance.</p>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <div className="flex items-center gap-3">
                <Phone className="text-primary" size={20} />
                <span>+1 (212) 555-0148</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-primary" size={20} />
                <span>hello@luxestate.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-primary" size={20} />
                <span>London · New York · Dubai · Singapore</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Follow Us</h3>
              <div className="flex gap-3 text-primary font-medium">
                <a href="#" className="hover:underline">
                  Instagram
                </a>
                <a href="#" className="hover:underline">
                  LinkedIn
                </a>
                <a href="#" className="hover:underline">
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
