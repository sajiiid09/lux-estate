"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function PaymentContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("booking_id")

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-4">Payment Gateway</h1>
        <p className="text-gray-600 mb-6">
          This is a placeholder for the payment integration (Phase 5).
        </p>
        {bookingId && (
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg mb-6">
            Processing Booking ID: <span className="font-bold">{bookingId}</span>
          </div>
        )}
        <button disabled className="w-full py-3 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed">
          Payment Integration Coming Soon
        </button>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  )
}
