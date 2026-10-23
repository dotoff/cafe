import Link from 'next/link'

interface FooterProps {
  settings?: any
  categories?: any[]
}

export function Footer({ settings, categories = [] }: FooterProps) {
  const storeName = settings?.storeName || 'Flavourite'
  const address = settings?.businessAddress || 'Main Road, Samalkot, Kakinada District, Andhra Pradesh - 533440'
  const fssai = settings?.fssaiNumber
  const phone = settings?.phoneSupport || settings?.whatsappNumber || '+91 70132 05977'
  const cleanPhone = (settings?.whatsappNumber || '917013205977').replace(/[^0-9]/g, '')
  const email = settings?.contactEmail || 'flavouritefood@gmail.com'

  // Default categories if none passed
  const displayCategories = categories.length > 0 
    ? categories.slice(0, 5) 
    : [
        { title: 'Chocolates', slug: 'chocolates' },
        { title: 'Brownies', slug: 'brownies' },
        { title: 'Gift Hampers', slug: 'hampers' },
        { title: 'Herbal Tea', slug: 'tea' },
      ]

  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8 mt-16 print:hidden">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div className="md:col-span-1">
          <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
            <span className="text-2xl transition-transform group-hover:scale-110">🌿</span>
            <h3 className="text-2xl font-serif text-white m-0 p-0">{storeName}</h3>
          </Link>
          <p className="text-xs uppercase tracking-widest text-emerald-300 font-sans mb-3">Food & Beverage • 100% Vegetarian</p>
          <p className="text-sm text-gray-300 leading-relaxed mb-4">
            Deliciously handcrafted chocolates, fresh baked brownies, festival gift hampers, and herbal teas. Handcrafted with premium ingredients.
          </p>
          
          {fssai && (
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-200 border border-white/10 mb-4">
              <span>🛡️</span>
              <span>FSSAI Lic: <strong>{fssai}</strong></span>
            </div>
          )}

          <div className="text-xs text-gray-300 space-y-1">
            <p className="flex items-start gap-1.5">
              <span>📍</span>
              <span>{address}</span>
            </p>
            <p className="flex items-center gap-1.5 pt-1">
              <span>💬</span>
              <a 
                href={`https://wa.me/${cleanPhone}?text=Hi%20Flavourite%20Bakery,%20I%20have%20an%20inquiry`} 
                target="_blank" 
                rel="noreferrer"
                className="text-emerald-300 hover:underline font-medium"
              >
                WhatsApp: {phone}
              </a>
            </p>
            <p className="flex items-center gap-1.5">
              <span>✉️</span>
              <a href={`mailto:${email}`} className="text-gray-300 hover:text-white">
                {email}
              </a>
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-lg text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/shop" className="hover:text-white transition-colors">Shop All Goodies</Link></li>
            <li><Link href="/track-order" className="hover:text-white transition-colors">📦 Live Order Tracking</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Flavourite</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Bakery</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-lg text-white">Categories</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {displayCategories.map((cat: any) => (
              <li key={cat.slug || cat.title}>
                <Link href={`/shop?category=${cat.slug}`} className="hover:text-white transition-colors">
                  {cat.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-1">
          <h4 className="font-semibold mb-4 text-lg text-white">Policies & Trust</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund & Cancellation</Link></li>
            <li><Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
          </ul>
          <div className="mt-6 pt-4 border-t border-white/10 text-xs text-emerald-200/80">
            <span>✨ Same-Day Local Delivery in Samalkot & Kakinada</span>
            <br />
            <span>📦 Pan-India Courier for Chocolates & Hampers</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-4">
        <div>© {new Date().getFullYear()} Flavourite Food & Beverage. Handcrafted with ❤️ in Samalkot, Andhra Pradesh.</div>
        <div className="flex gap-4">
          <Link href="/terms" className="hover:text-white">Terms</Link>
          <Link href="/privacy-policy" className="hover:text-white">Privacy</Link>
          <Link href="/refund-policy" className="hover:text-white">Refunds</Link>
          <Link href="/shipping-policy" className="hover:text-white">Shipping</Link>
          <Link href="/contact" className="hover:text-white">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
