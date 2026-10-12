import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { ShopClient } from './ShopClient'

async function getShopData() {
  try {
    const payload = await getPayload({ config })
    
    // Fetch all products for instant client-side filtering
    const { docs: products } = await payload.find({
      collection: 'products',
      limit: 1000,
      sort: 'name',
    })
    
    const { docs: categories } = await payload.find({
      collection: 'categories',
      sort: 'title',
    })
    
    return { products, categories }
  } catch (e) {
    return { products: [], categories: [] }
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const { category, q: query } = await searchParams
  const data = await getShopData()
  
  const initialProducts = data.products
  const initialCategories = data.categories

  return (
    <div className="bg-brand-cream min-h-screen">
      
      {/* Page Banner */}
      <div className="bg-gradient-to-r from-brand-dark to-brand-medium text-white py-16 text-center">
        <h1 className="text-4xl font-serif mb-4">Shop</h1>
        <p className="text-white/80 text-sm">
          <Link href="/" className="hover:text-white transition-colors">Home</Link> <span className="mx-2">›</span> Shop
        </p>
      </div>

      <ShopClient 
        initialProducts={initialProducts} 
        categories={initialCategories} 
        initialCategory={category} 
        initialQuery={query} 
      />
      
    </div>
  )
}
