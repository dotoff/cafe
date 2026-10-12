import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="bg-gradient-to-r from-brand-dark to-brand-medium text-white py-16 text-center">
        <h1 className="text-4xl font-serif mb-4">About Us</h1>
        <p className="text-white/80 text-sm">
          <Link href="/" className="hover:text-white">Home</Link> <span className="mx-2">›</span> About Us
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-serif text-brand-dark mb-6">Our Sweet Story</h2>
        <p className="text-gray-600 leading-relaxed mb-8 text-lg">
          Flavourite Food & Beverage was founded with a simple belief: food should be made with love, using the finest ingredients, and without any compromise on quality or values. As a proudly 100% vegetarian brand, we craft every chocolate, brownie, cookie, and tea blend without eggs or meat.
        </p>
        <p className="text-gray-600 leading-relaxed mb-12 text-lg">
          From our kitchen to your doorstep, every product is handcrafted in small batches to ensure freshness, packed beautifully for gifting, and delivered safely across India.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="text-4xl mb-4">🌿</div>
            <h3 className="text-xl font-bold text-brand-dark mb-2">100% Vegetarian</h3>
            <p className="text-gray-500">Every product is purely vegetarian — no eggs, no meat, no gelatin. Indulgence without compromise.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-bold text-brand-dark mb-2">Premium Quality</h3>
            <p className="text-gray-500">We use only the finest ingredients sourced globally — Belgian chocolate, Nilgiri tea, and more.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-xl font-bold text-brand-dark mb-2">Gift-Ready</h3>
            <p className="text-gray-500">Beautiful packaging that makes every order feel like a gift — perfect for celebrations.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
