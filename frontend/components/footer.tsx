import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-foreground text-background pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-background rounded-sm flex items-center justify-center">
                <span className="text-foreground font-serif font-bold text-lg">L</span>
              </div>
              <span className="font-serif text-xl font-bold">LuxEstate</span>
            </div>
            <p className="text-background/80 text-sm">Premium luxury real estate for discerning clients worldwide.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-background mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-background/80 hover:text-background transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/80 hover:text-background transition">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/80 hover:text-background transition">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/80 hover:text-background transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-background mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-background/80 hover:text-background transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/80 hover:text-background transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/80 hover:text-background transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-background/80 hover:text-background transition">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-background mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} className="flex-shrink-0" />
                <span className="text-background/80">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="flex-shrink-0" />
                <span className="text-background/80">hello@luxestate.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                <span className="text-background/80">New York, Los Angeles, London</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-background/80">
            <p>&copy; 2025 LuxEstate. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <Link href="#" className="hover:text-background transition">
                Instagram
              </Link>
              <Link href="#" className="hover:text-background transition">
                LinkedIn
              </Link>
              <Link href="#" className="hover:text-background transition">
                Twitter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
