import { notFound } from "next/navigation"
import api from "@/lib/api"
import PropertyClient from "./client"

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params

  try {
    const response = await api.get(`/api/properties/${slug}/`)
    const property = response.data

    let similarProperties = []
    if (property.category) {
      try {
        const similarRes = await api.get(`/api/properties/recommended/?category_id=${property.category}`)
        // Filter out current property and limit to 3
        similarProperties = similarRes.data
          .filter((p: any) => p.id !== property.id)
          .slice(0, 3)
      } catch (simErr) {
        console.error("Failed to fetch similar properties", simErr)
      }
    }

    return <PropertyClient property={property} similarProperties={similarProperties} />
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      notFound()
    }
    
    // For other errors, we can throw or render a simple error message
    // Throwing allows error.tsx to catch it
    throw error
  }
}
