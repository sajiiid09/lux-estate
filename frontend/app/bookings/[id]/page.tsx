"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, CreditCard, MapPin } from "lucide-react"

import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { resolveMediaUrl } from "@/lib/utils"

interface Property {
  id: number
  title: string
  slug: string
  location: string
  image: string | null
  image_url?: string | null
  price: number
}

interface Booking {
  id: number
  property: Property
  total_amount: number
  status: "PENDING" | "CONFIRMED" | "CANCELED" | "PAID"
  created_at: string
}

interface BookingDetailPageProps {
  params: { id: string }
}

export default function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/bookings/${params.id}`)
    }
  }, [authLoading, isAuthenticated, params.id, router])

  useEffect(() => {
    const fetchBooking = async () => {
      if (!isAuthenticated) return
      setError("")
      try {
        const response = await api.get(`/api/bookings/${params.id}/`)
        setBooking(response.data)
      } catch (err) {
        console.error("Failed to fetch booking detail", err)
        setError("Unable to load this booking right now.")
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [isAuthenticated, params.id])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-background px-4">
        <p className="text-red-500 mb-4">{error || "Booking not found."}</p>
        <Link href="/bookings" className="text-primary hover:underline">
          Back to My Bookings
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Booking #{booking.id}</h1>
            <p className="text-muted-foreground">Review your reservation details below.</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
              booking.status === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : booking.status === "PAID"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {booking.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-white shadow-sm overflow-hidden">
              <div className="h-64 bg-muted relative">
                <img
                  src={
                    resolveMediaUrl(booking.property.image_url || booking.property.image) ||
                    "/placeholder.svg"
                  }
                  alt={booking.property.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-foreground">{booking.property.title}</h2>
                    <div className="flex items-center text-muted-foreground gap-2 mt-1">
                      <MapPin size={16} />
                      <span>{booking.property.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-primary">${Number(booking.total_amount).toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    <span>Booked on {new Date(booking.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-primary" />
                    <span>Status: {booking.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4 p-6 rounded-xl border border-border bg-white shadow-sm h-fit">
            <h3 className="text-lg font-semibold text-foreground">Next Steps</h3>
            <p className="text-sm text-muted-foreground">
              Proceed to payment to confirm your booking or return to your bookings list to review other reservations.
            </p>
            {booking.status === "PENDING" ? (
              <Link
                href={`/payment?booking_id=${booking.id}`}
                className="block text-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
              >
                Continue to Payment
              </Link>
            ) : (
              <div className="px-4 py-3 rounded-lg border border-border bg-muted text-center text-sm text-muted-foreground">
                Payment completed or not required.
              </div>
            )}
            <Link
              href={`/properties/${booking.property.slug}`}
              className="block text-center px-6 py-3 border border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition"
            >
              View Property
            </Link>
            <Link href="/bookings" className="block text-center text-sm text-muted-foreground hover:text-primary transition">
              Back to My Bookings
            </Link>
          </aside>
        </div>
      </div>
    </div>
  )
}

