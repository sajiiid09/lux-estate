"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { CheckCircle, MapPin, Calendar, ArrowRight } from "lucide-react"

interface Property {
  id: number
  title: string
  slug: string
  location: string
  image: string | null
}

interface Booking {
  id: number
  property: Property
  total_amount: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'PAID'
  created_at: string
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("booking_id")
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, authLoading, router])

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId || !isAuthenticated) return
      try {
        const response = await api.get(`/api/bookings/${bookingId}/`)
        setBooking(response.data)
      } catch (err) {
        console.error("Failed to fetch booking", err)
      } finally {
        setLoading(false)
      }
    }
    fetchBooking()
  }, [bookingId, isAuthenticated])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
            <p className="text-gray-600 mb-4">Booking not found.</p>
            <Link href="/" className="text-primary hover:underline">Return Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
      <div className="max-w-lg w-full px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-green-600 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-green-100">Your booking has been confirmed.</p>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-4 font-semibold">Booking Summary</p>
              
              <div className="flex items-start mb-6">
                <img 
                  src={booking.property.image || "/placeholder.svg"} 
                  alt={booking.property.title}
                  className="w-24 h-24 object-cover rounded-lg shadow-sm mr-4"
                />
                <div>
                  <h3 className="font-serif font-bold text-lg text-gray-900 mb-1">{booking.property.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin size={14} className="mr-1" />
                    {booking.property.location}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar size={14} className="mr-1" />
                    {new Date(booking.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                <span className="text-gray-600">Amount Paid</span>
                <span className="text-2xl font-bold text-gray-900">${Number(booking.total_amount).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link 
                href="/bookings"
                className="block w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-center hover:opacity-90 transition shadow-md"
              >
                View My Bookings
              </Link>
              <Link 
                href="/"
                className="block w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-center hover:bg-gray-50 transition"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
      <SuccessContent />
    </Suspense>
  )
}
