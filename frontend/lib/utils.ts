import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function resolveMediaUrl(path?: string | null) {
  if (!path) return null
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }
  
  // Static frontend assets
  if (path.startsWith("/properties/") || path.startsWith("/images/") || path.startsWith("/placeholder")) {
    return path
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  if (path.startsWith("/")) {
    return `${baseUrl}${path}`
  }

  return `${baseUrl}/${path}`
}
