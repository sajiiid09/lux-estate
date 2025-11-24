'use client'

import { useCallback, useMemo, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export function useBooking() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const handleLoginRedirect = useCallback(
    (redirectPath?: string) => {
      const destination = redirectPath || pathname
      router.push(`/login?redirect=${encodeURIComponent(destination)}`)
    },
    [pathname, router],
  )

  const createBooking = useCallback(
    async (propertyId: number, redirectPath?: string) => {
      if (!isAuthenticated) {
        handleLoginRedirect(redirectPath)
        return
      }

      setLoadingId(propertyId)
      setError('')

      try {
        const response = await api.post('/api/bookings/create/', {
          property_id: propertyId,
        })

        router.push(`/payment?booking_id=${response.data.id}`)
      } catch (err: any) {
        const message = err?.response?.data?.detail || 'Failed to create booking. Please try again.'
        setError(message)
      } finally {
        setLoadingId(null)
      }
    },
    [handleLoginRedirect, isAuthenticated, router],
  )

  const state = useMemo(
    () => ({
      loadingId,
      error,
    }),
    [loadingId, error],
  )

  return { ...state, createBooking, setError }
}

