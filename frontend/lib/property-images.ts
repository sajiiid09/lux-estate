import alpine from "@/public/properties/alpine.png"
import dubaiWaterfront from "@/public/properties/dubaiwather.png"
import mansionOcean from "@/public/properties/luxury-mansion-with-ocean-view.jpg"
import penthouseNyc from "@/public/properties/luxury-penthouse-nyc.jpg"
import londonTownhouse from "@/public/properties/heritage.png"
import malibuSunset from "@/public/properties/malibu-beach-sunset-california.jpg"
import mediterraneanFrance from "@/public/properties/mediterranean-villa-france.jpg"
import parisApartment from "@/public/properties/paris_apr.png"
import retailShop from "@/public/properties/retailshop.png"
import dubaiVilla from "@/public/properties/dubaivilla.png"
import warehouseRetail from "@/public/properties/warehouse_retail.png"
import mediterraneanVilla from "@/public/properties/luxury-mediterranean-villa.jpg"
import officeLoft from "@/public/properties/ofiice3.png"
import mountainRange from "@/public/properties/mountain2.png"
import placeholder from "@/public/properties/placeholder.jpg"

export const propertyImageMap: Record<string, string> = {
  "the-modern-villa": mediterraneanFrance.src,
  "oceanview-glass-retreat": mansionOcean.src,
  "sky-garden-penthouse": penthouseNyc.src,
  "the-heritage-manor": londonTownhouse.src,
  "aspen-winter-lodge": alpine.src,
  "vibe-coder-open-workspace": officeLoft.src,
  "carribean-island-parcel": malibuSunset.src,
  "historic-le-marais": parisApartment.src,
  "fifth-avenue-retail-shop": retailShop.src,
  "dubai-palm-jumeirah-villa": dubaiVilla.src,
  "logistics-datacenter": warehouseRetail.src,
  "tuscan-vineyard": mediterraneanVilla.src,
  "soho-artist-loft": officeLoft.src,
  "montana-big-sky": mountainRange.src,
  "como-contemporary": dubaiWaterfront.src,
  "test-property": placeholder.src,
}

export function getPropertyImage(slug?: string | null) {
  if (!slug) return null
  return propertyImageMap[slug.toLowerCase()] || null
}
