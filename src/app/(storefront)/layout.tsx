import type { Metadata } from 'next'
import '@/app/globals.css'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Flavourite Cafe',
  description: 'Moments are Sweeter with Flavourite',
}

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          
          <footer className="bg-brand-dark text-white pt-16 pb-8 mt-16 print:hidden">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-1">
                <h3 className="text-2xl font-serif mb-1">🍃 Flavourite</h3>
                <p className="text-xs uppercase tracking-widest opacity-70 mb-4">Food & Beverage</p>
                <p className="text-sm opacity-80 leading-relaxed mb-6">
                  Deliciously handcrafted chocolates, baked goodies, gift hampers, and herbal teas. 100% vegetarian, made with premium ingredients.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
                <ul className="space-y-2 text-sm opacity-80">
                  <li><a href="/" className="hover:opacity-100 transition-opacity">Home</a></li>
                  <li><a href="/shop" className="hover:opacity-100 transition-opacity">Shop</a></li>
                  <li><a href="/track-order" className="hover:opacity-100 transition-opacity">Track Order</a></li>
                  <li><a href="/about" className="hover:opacity-100 transition-opacity">About Us</a></li>
                  <li><a href="/contact" className="hover:opacity-100 transition-opacity">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-lg">Categories</h4>
                <ul className="space-y-2 text-sm opacity-80">
                  <li><a href="/shop?category=chocolates" className="hover:opacity-100 transition-opacity">Chocolates</a></li>
                  <li><a href="/shop?category=brownies" className="hover:opacity-100 transition-opacity">Brownies</a></li>
                  <li><a href="/shop?category=hampers" className="hover:opacity-100 transition-opacity">Gift Hampers</a></li>
                  <li><a href="/shop?category=tea" className="hover:opacity-100 transition-opacity">Herbal Tea</a></li>
                </ul>
              </div>
              <div className="md:col-span-1">
                <h4 className="font-semibold mb-4 text-lg">Policies</h4>
                <ul className="space-y-2 text-sm opacity-80">
                  <li><a href="/terms" className="hover:opacity-100 transition-opacity">Terms & Conditions</a></li>
                  <li><a href="/privacy-policy" className="hover:opacity-100 transition-opacity">Privacy Policy</a></li>
                  <li><a href="/refund-policy" className="hover:opacity-100 transition-opacity">Refund & Cancellation</a></li>
                  <li><a href="/shipping-policy" className="hover:opacity-100 transition-opacity">Shipping & Delivery</a></li>
                </ul>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 border-t border-white/20 pt-8 flex flex-col md:flex-row items-center justify-between text-xs opacity-60 gap-4">
              <div>© 2026 Flavourite Food & Beverage. Handcrafted with ❤️ in Samalkot, Andhra Pradesh.</div>
              <div className="flex gap-4">
                <a href="/terms" className="hover:underline">Terms</a>
                <a href="/privacy-policy" className="hover:underline">Privacy</a>
                <a href="/refund-policy" className="hover:underline">Refunds</a>
                <a href="/shipping-policy" className="hover:underline">Shipping</a>
                <a href="/contact" className="hover:underline">Contact</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
