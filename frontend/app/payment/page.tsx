"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"
import { CheckCircle, CreditCard, DollarSign, Shield } from "lucide-react"
import { resolveMediaUrl } from "@/lib/utils"

interface Property {
  id: number
  title: string
  location: string
  image: string | null
  image_url?: string | null
  price: number
}

interface Booking {
  id: number
  property: Property
  total_amount: number
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'PAID'
  created_at: string
}

function PaymentContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("booking_id")
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  const [selectedProvider, setSelectedProvider] = useState<"STRIPE" | "BKASH">("STRIPE")
  const [paymentInitiated, setPaymentInitiated] = useState(false)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/payment?booking_id=${bookingId}`)
    }
  }, [isAuthenticated, authLoading, router, bookingId])

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId || !isAuthenticated) return
      try {
        const response = await api.get(`/api/bookings/${bookingId}/`)
        setBooking(response.data)
      } catch (err) {
        console.error("Failed to fetch booking", err)
        setError("Failed to load booking details.")
      } finally {
        setLoading(false)
      }
    }
    fetchBooking()
  }, [bookingId, isAuthenticated])

  const [paymentResult, setPaymentResult] = useState<any>(null)

  const handleInitiatePayment = async () => {
    if (!booking) return
    setProcessing(true)
    setError("")
    try {
      const response = await api.post("/api/payments/initiate/", {
        booking_id: booking.id,
        provider: selectedProvider
      })
      setPaymentResult(response.data)
      setPaymentInitiated(true)
    } catch (err: any) {
      console.error("Payment initiation failed", err)
      setError(err.response?.data?.detail || "Failed to initiate payment.")
    } finally {
      setProcessing(false)
    }
  }

  const handleSimulateSuccess = async () => {
    if (!booking) return
    setProcessing(true)
    try {
      // Simulate Webhook based on provider
      const webhookUrl = selectedProvider === "STRIPE" 
        ? "/api/payments/webhook/stripe/" 
        : "/api/payments/webhook/bkash/"
      
      await api.post(webhookUrl, {
        booking_id: booking.id,
        status: "SUCCESS",
        transaction_id: `sim_${selectedProvider.toLowerCase()}_${Date.now()}`
      })

      // Poll for status update
      let attempts = 0
      const maxAttempts = 5
      
      const checkStatus = async () => {
        try {
            const res = await api.get(`/api/bookings/${booking.id}/`)
            if (res.data.status === "PAID") {
                router.push(`/payment/success?booking_id=${booking.id}`)
            } else if (attempts < maxAttempts) {
                attempts++
                setTimeout(checkStatus, 1000)
            } else {
                setError("Payment simulation completed, but booking status update timed out. Please refresh.")
                setProcessing(false)
            }
        } catch (e) {
            console.error("Status check failed", e)
            setProcessing(false)
        }
      }
      
      checkStatus()

    } catch (err) {
      console.error("Simulation failed", err)
      setError("Simulation failed.")
      setProcessing(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <Shield size={48} className="mx-auto mb-2" />
            <h2 className="text-xl font-bold">Error</h2>
          </div>
          <p className="text-gray-600 mb-6">{error || "Booking not found."}</p>
          <button 
            onClick={() => router.push("/bookings")}
            className="text-primary hover:underline"
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">Secure Payment</h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Booking Summary Header */}
          <div className="bg-gray-900 text-white p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Payment Amount</p>
                <div className="text-3xl font-bold">${Number(booking.total_amount).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">Booking ID</p>
                <p className="font-mono font-medium">#{booking.id}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <img
                  src={
                    resolveMediaUrl(booking.property.image_url || booking.property.image) ||
                    "/placeholder.svg"
                  }
                  alt={booking.property.title}
                  className="w-20 h-20 object-cover rounded-md mr-4"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{booking.property.title}</h4>
                  <p className="text-sm text-gray-500">{booking.property.location}</p>
                </div>
              </div>
            </div>

            {!paymentInitiated ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setSelectedProvider("STRIPE")}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition flex items-center ${
                        selectedProvider === "STRIPE" 
                          ? "border-primary bg-primary/5" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                        selectedProvider === "STRIPE" ? "border-primary" : "border-gray-300"
                      }`}>
                        {selectedProvider === "STRIPE" && <div className="w-3 h-3 rounded-full bg-primary" />}
                      </div>
                      <CreditCard className="mr-3 text-gray-600" />
                      <span className="font-medium">Credit Card (Stripe)</span>
                    </div>

                    <div 
                      onClick={() => setSelectedProvider("BKASH")}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition flex items-center ${
                        selectedProvider === "BKASH" 
                          ? "border-primary bg-primary/5" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                        selectedProvider === "BKASH" ? "border-primary" : "border-gray-300"
                      }`}>
                        {selectedProvider === "BKASH" && <div className="w-3 h-3 rounded-full bg-primary" />}
                      </div>
                      <DollarSign className="mr-3 text-gray-600" />
                      <span className="font-medium">bKash</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleInitiatePayment}
                  disabled={processing}
                  className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:opacity-90 transition disabled:opacity-50 flex justify-center items-center"
                >
                  {processing ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"/>
                      Processing...
                    </>
                  ) : (
                    `Pay $${Number(booking.total_amount).toLocaleString()}`
                  )}
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Initiated</h3>
                <p className="text-gray-600 mb-6">
                  You have selected <strong>{selectedProvider === "STRIPE" ? "Credit Card" : "bKash"}</strong>.
                </p>

                {paymentResult && (
                  <div className="bg-gray-50 p-4 rounded-lg text-left mb-6 text-sm font-mono border border-gray-200 overflow-x-auto">
                    <p><strong>Status:</strong> {paymentResult.status}</p>
                    <p><strong>Transaction ID:</strong> {paymentResult.transaction_id}</p>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-primary hover:underline">View Raw Response</summary>
                      <pre className="mt-2 text-xs text-gray-500 whitespace-pre-wrap">
                        {JSON.stringify(paymentResult.raw_response, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6">
                    <h4 className="font-semibold text-blue-900 mb-2">Development Mode</h4>
                    <p className="text-blue-700 text-sm mb-4">
                        Since this is a demo environment, you can simulate a successful transaction below.
                        This will trigger the <strong>{selectedProvider}</strong> webhook.
                    </p>
                    <button
                    onClick={handleSimulateSuccess}
                    disabled={processing}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center"
                    >
                    {processing ? "Verifying..." : "Simulate Payment Success"}
                    </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center mt-8">
            <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-900 text-sm">
                Cancel and return
            </button>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
      <PaymentContent />
    </Suspense>
  )
}
