"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { Calendar, MapPin, CreditCard } from "lucide-react"

interface Property {
  id: number
  title: string
  slug: string
  location: string
  image: string | null
  price: number
}

interface Booking {
  id: number
  property: Property
  total_amount: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'PAID'
  created_at: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/bookings")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return

      try {
        const response = await api.get("/api/bookings/")
        setBookings(response.data)
      } catch (err) {
        console.error("Failed to fetch bookings", err)
        setError("Failed to load your bookings.")
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchBookings()
    }
  }, [isAuthenticated])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">My Bookings</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h2>
            <p className="text-gray-500 mb-6">You haven't made any bookings yet.</p>
            <Link
              href="/properties"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row"
              >
                <div className="md:w-1/3 h-48 md:h-auto relative bg-gray-200">
                  <img
                    src={booking.property.image || "/placeholder.svg"}
                    alt={booking.property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-serif font-bold text-gray-900">
                        {booking.property.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                          booking.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.status === "CONFIRMED" || booking.status === "PAID"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500 mb-4">
                      <MapPin size={16} className="mr-1" />
                      <span className="text-sm">{booking.property.location}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                            <Calendar size={16} className="mr-2 text-primary" />
                            <span>Booked on {new Date(booking.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center">
                            <CreditCard size={16} className="mr-2 text-primary" />
                            <span className="font-semibold">${Number(booking.total_amount || booking.property.price).toLocaleString()}</span>
                        </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    {booking.status === "PENDING" && (
                      <Link
                        href={`/payment?booking_id=${booking.id}`}
                        className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition"
                      >
                        Proceed to Payment
                      </Link>
                    )}
                    <Link
                        href={`/properties/${booking.property.slug}`}
                        className="ml-4 inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                    >
                        View Property
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
