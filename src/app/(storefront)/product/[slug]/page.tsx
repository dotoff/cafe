import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { ArrowLeft, Leaf, Star, ShieldCheck } from 'lucide-react'
import { ProductForm } from '@/components/ProductForm'

async function getProduct(slug: string) {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    return docs[0] || null
  } catch (e) {
    return null
  }
}

import { notFound } from 'next/navigation'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params
  const slug = decodeURIComponent(rawSlug)
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const p = product

  const imageUrl = p.image && typeof p.image === 'object' && p.image.url ? p.image.url : null
  const categoryName = p.category && typeof p.category === 'object' ? p.category.title : 'Shop'

  return (
    <div className="bg-brand-cream min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        <Link href="/shop" className="inline-flex items-center gap-2 text-brand-dark hover:text-brand-medium font-medium mb-8">
          <ArrowLeft size={20} /> Back to Shop
        </Link>
        
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row">
          
          {/* Product Image */}
          <div className="md:w-1/2 bg-brand-creamdark p-12 flex items-center justify-center min-h-[400px]">
            {imageUrl ? (
              <img src={imageUrl} alt={p.name} className="w-full h-full object-contain mix-blend-multiply" />
            ) : (
              <div className="text-9xl">🍫</div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="md:w-1/2 p-8 md:p-12">
            <div className="flex items-center gap-2 text-sm text-brand-medium font-semibold uppercase tracking-wider mb-2">
              <Leaf size={16} /> {categoryName}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-brand-dark leading-tight mb-4">{p.name}</h1>
            
            <div className="flex items-center gap-4 mb-8 text-sm text-gray-600">
              <div className="flex text-yellow-500"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
              <span>4.9 (120 reviews)</span>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {p.description}
            </p>
            
            <hr className="border-gray-100 mb-8" />
            
            {/* The Form handles variants, price, and adding to cart */}
            <ProductForm product={p} />
            
            <div className="mt-8 flex flex-col gap-3 pt-6 border-t border-gray-100">
              {p.isEggless !== false && (
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Leaf size={18} className="text-green-600" /> 100% Vegetarian & Eggless
                </div>
              )}
              {p.shelfLife && (
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="text-base">🕒</span> {p.shelfLife}
                </div>
              )}
              {p.netWeight && (
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="text-base">⚖️</span> Net Quantity: {p.netWeight}
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <ShieldCheck size={18} className="text-blue-600" /> Handcrafted in Small Batches
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
