import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { ArrowRight, Leaf, Star, Gift, Truck } from 'lucide-react'
import { ProductCard } from '@/components/ProductCard'

// Helper to determine if a hex color is "light" or "dark" for text contrast
const isDarkColor = (color: string) => {
  if (!color) return false
  const hex = color.startsWith('#') ? color.replace('#', '') : ''
  if (!hex) return ['chocolate', 'pink', 'blue', 'dark', 'purple'].includes(color)
  const r = parseInt(hex.substring(0, 2), 16) || 0
  const g = parseInt(hex.substring(2, 4), 16) || 0
  const b = parseInt(hex.substring(4, 6), 16) || 0
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.5
}

// Helper for banner themes
const getBannerGradient = (theme: string) => {
  if (theme?.startsWith('#')) return theme // Solid hex color
  switch (theme) {
    case 'chocolate': return '#5D4037'
    case 'gold': return '#FBC02D'
    case 'pink': return '#E91E63'
    case 'blue': return '#1976D2'
    case 'dark': return '#1e3f20'
    default: return '#FDFBF7'
  }
}

// Helper for category themes
const getCategoryGradient = (theme: string) => {
  if (theme?.startsWith('#')) return theme // Solid hex color
  switch (theme) {
    case 'chocolate': return '#5D4037'
    case 'pink': return '#E91E63'
    case 'cream': return '#FFF9C4'
    case 'mint': return '#81C784'
    case 'purple': return '#8E24AA'
    case 'gold': return '#FBC02D'
    default: return '#5D4037'
  }
}

async function getHomepageData() {
  try {
    const payload = await getPayload({ config })
    
    const [banners, categories, bestSellersResult] = await Promise.all([
      payload.find({ collection: 'banners', where: { isActive: { equals: true } }, limit: 1 }),
      payload.find({ collection: 'categories', limit: 10, sort: 'title' }),
      payload.find({ collection: 'products', where: { isBestSeller: { equals: true } }, limit: 4 }),
    ])
    
    // If no best sellers are flagged yet, show latest 4 products
    let bestSellers = bestSellersResult.docs
    if (bestSellers.length === 0) {
      const anyProducts = await payload.find({ collection: 'products', limit: 4, sort: '-createdAt' })
      bestSellers = anyProducts.docs
    }
    
    return {
      banners: banners.docs,
      categories: categories.docs,
      bestSellers,
    }
  } catch (e) {
    return { banners: [], categories: [], bestSellers: [] }
  }
}

// Check if theme is exactly the brand cream to preserve brand green accents
const isBrandCream = (theme: string) => {
  return !theme || theme === 'default' || theme.toUpperCase() === '#FDFBF7'
}

// Helper for full-width banner text color
const getBannerTextColor = (theme: string) => {
  if (isDarkColor(theme)) return 'text-white'
  return isBrandCream(theme) ? 'text-brand-dark' : 'text-gray-900'
}

const getBannerSubTextColor = (theme: string) => {
  if (isDarkColor(theme)) return 'text-white/80'
  return isBrandCream(theme) ? 'text-brand-dark/80' : 'text-gray-700'
}

export default async function Home() {
  const data = await getHomepageData()
  
  const displayCategories = data.categories
  const displayProducts = data.bestSellers
  const banner = data.banners.length > 0 ? data.banners[0] : null

  const bannerImageUrl = banner?.image && typeof banner.image === 'object' ? banner.image.url : null
  const theme = banner?.colorTheme || 'default'

  return (
    <div className="bg-brand-cream min-h-screen">
      
      {/* Hero Section */}
      <section 
        className="py-16 md:py-24 transition-colors duration-500"
        style={{ background: getBannerGradient(theme) }}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <h1 className={`text-4xl md:text-6xl font-serif italic leading-tight mb-6 ${getBannerTextColor(theme)}`}>
              {banner?.title || 'Moments are Sweeter with Flavourite'}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
              <div className={`h-0.5 w-12 ${isDarkColor(theme) ? 'bg-white/30' : (isBrandCream(theme) ? 'bg-brand-dark' : 'bg-gray-900/20')}`}></div>
              <span className="text-brand-gold text-2xl">✨</span>
              <div className={`h-0.5 w-12 ${isDarkColor(theme) ? 'bg-white/30' : (isBrandCream(theme) ? 'bg-brand-dark' : 'bg-gray-900/20')}`}></div>
            </div>
            <p className={`mb-8 whitespace-pre-line ${getBannerSubTextColor(theme)}`}>
              {banner?.description || 'Chocolates | Baked Goodies | Gift Hampers | Herbal Tea'}
            </p>
            <Link 
              href={banner?.buttonLink || '/shop'} 
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1 ${
                isDarkColor(theme) 
                  ? (['dark', '#1e3f20', '#1E3F20'].includes(theme) ? 'bg-white text-brand-dark hover:bg-gray-100' : 'bg-white text-gray-900 hover:bg-gray-100')
                  : (isBrandCream(theme) ? 'bg-brand-dark text-white hover:bg-brand-medium' : 'bg-gray-900 text-white hover:bg-gray-800')
              }`}
            >
              {banner?.buttonText || 'SHOP NOW'} <ArrowRight size={20} />
            </Link>
          </div>
          
          <div className="flex-1 w-full max-w-md">
            <div 
              className="aspect-[4/3] rounded-2xl shadow-2xl flex items-center justify-center text-7xl overflow-hidden bg-black/10 border-4 border-white/20"
            >
              {bannerImageUrl ? (
                <img src={bannerImageUrl} alt={banner?.title} className="w-full h-full object-cover" />
              ) : (
                '🛍️'
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Leaf className="mx-auto text-brand-dark mb-2" size={32} />
          <h2 className="text-3xl md:text-4xl font-serif text-brand-dark mb-12 flex items-center justify-center gap-4">
            <div className="h-0.5 w-12 bg-brand-dark"></div>
            Shop by Category
            <div className="h-0.5 w-12 bg-brand-dark"></div>
          </h2>
          
          <div className="flex flex-wrap justify-center gap-8">
            {displayCategories.map((cat: any) => (
              <Link href={`/shop?category=${cat.slug}`} key={cat.id} className="group flex flex-col items-center">
                <div 
                  className="w-28 h-28 rounded-full flex items-center justify-center text-4xl mb-4 border-4 border-brand-cream transition-all duration-300 group-hover:border-brand-dark group-hover:shadow-lg group-hover:-translate-y-2"
                  style={{ background: getCategoryGradient(cat.colorTheme) }}
                >
                  {cat.emoji || '📦'}
                </div>
                <span className="font-medium text-gray-800">{cat.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <Leaf className="text-brand-dark mb-2" size={32} />
            <h2 className="text-3xl md:text-4xl font-serif text-brand-dark flex items-center gap-4">
              <div className="h-0.5 w-12 bg-brand-dark"></div>
              <em>Best Sellers</em>
              <div className="h-0.5 w-12 bg-brand-dark"></div>
            </h2>
          </div>
          <Link href="/shop" className="hidden sm:flex text-brand-dark font-semibold hover:text-brand-medium items-center gap-2">
            View All Products <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <Link href="/shop" className="inline-flex text-brand-dark font-semibold hover:text-brand-medium items-center gap-2 border-b-2 border-brand-dark pb-1">
            View All Products <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-center justify-center gap-4">
            <Leaf className="text-green-600" size={40} />
            <div>
              <h4 className="font-bold text-gray-900">100% Vegetarian</h4>
              <p className="text-sm text-gray-500">No Eggs | No Meat</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Star className="text-yellow-500" size={40} />
            <div>
              <h4 className="font-bold text-gray-900">Premium Ingredients</h4>
              <p className="text-sm text-gray-500">Quality you can trust</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Gift className="text-brand-purple" size={40} />
            <div>
              <h4 className="font-bold text-gray-900">Beautifully Packed</h4>
              <p className="text-sm text-gray-500">Perfect for Gifting</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Truck className="text-blue-500" size={40} />
            <div>
              <h4 className="font-bold text-gray-900">Safe Delivery</h4>
              <p className="text-sm text-gray-500">Pan India</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
