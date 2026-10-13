'use client'

import { ProductCard } from '@/components/ProductCard'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { useState, useEffect } from 'react'

export function ShopClient({
  initialProducts,
  categories,
  initialCategory,
  initialQuery
}: {
  initialProducts: any[]
  categories: any[]
  initialCategory?: string
  initialQuery?: string
}) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategory)
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery || '')
  const [sortOption, setSortOption] = useState<string>('name-asc')
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  
  // Sync URL without page reload
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCategory) params.set('category', selectedCategory)
    if (searchQuery) params.set('q', searchQuery)
    
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`
    window.history.replaceState({}, '', newUrl)
  }, [selectedCategory, searchQuery])

  // Filter products
  let displayProducts = initialProducts
  
  if (selectedCategory) {
    displayProducts = displayProducts.filter(p => p.category?.slug === selectedCategory || p.category?.id === selectedCategory || p.category === selectedCategory)
  }
  
  if (searchQuery) {
    const queryLower = searchQuery.toLowerCase()
    displayProducts = displayProducts.filter(p => {
      // Match Product Name
      if (p.name.toLowerCase().includes(queryLower)) return true
      
      // Match Product Description
      if (p.description && p.description.toLowerCase().includes(queryLower)) return true
      
      // Match Category Name
      const catSlug = p.category?.slug || p.category?.id || p.category
      const categoryMatch = categories.find(c => c.slug === catSlug || c.id === catSlug)
      if (categoryMatch && categoryMatch.title.toLowerCase().includes(queryLower)) return true
      
      // Match Variant Names
      if (Array.isArray(p.variants) && p.variants.some((v: any) => v.name.toLowerCase().includes(queryLower))) return true
      
      return false
    })
  }

  // Sort products
  displayProducts.sort((a, b) => {
    const priceA = a.variants?.[0]?.price || a.price || 0
    const priceB = b.variants?.[0]?.price || b.price || 0
    
    switch (sortOption) {
      case 'price-asc': return priceA - priceB
      case 'price-desc': return priceB - priceA
      case 'name-desc': return b.name.localeCompare(a.name)
      case 'name-asc': 
      default:
        return a.name.localeCompare(b.name)
    }
  })

  const activeCategoryTitle = categories.find(c => c.slug === selectedCategory || c.id === selectedCategory)?.title

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden flex items-center justify-between bg-white border border-gray-100 p-4 rounded-xl shadow-sm mb-4">
        <span className="font-semibold text-gray-800">Filters & Search</span>
        <button onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)} className="p-2 bg-gray-100 rounded-lg">
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${isMobileFiltersOpen ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0 z-10`}>
        <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm md:sticky md:top-24">
          
          {/* Search */}
          <div className="mb-8 relative">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-dark focus:ring-2 focus:ring-brand-light/20 transition-all text-sm"
            />
            <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <h3 className="font-serif text-xl border-b border-gray-100 pb-4 mb-4 text-brand-dark">Categories</h3>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => { setSelectedCategory(undefined); setIsMobileFiltersOpen(false); }}
                className={`block text-sm text-left w-full transition-colors ${!selectedCategory ? 'font-bold text-brand-dark bg-brand-cream px-4 py-2.5 rounded-lg border border-brand-creamdark' : 'text-gray-600 hover:text-brand-dark px-4 py-2.5 rounded-lg hover:bg-gray-50'}`}
              >
                All Products
              </button>
            </li>
            {categories.map((cat: any) => (
              <li key={cat.id}>
                <button 
                  onClick={() => { setSelectedCategory(cat.slug); setIsMobileFiltersOpen(false); }}
                  className={`block text-sm text-left w-full transition-colors ${selectedCategory === cat.slug ? 'font-bold text-brand-dark bg-brand-cream px-4 py-2.5 rounded-lg border border-brand-creamdark' : 'text-gray-600 hover:text-brand-dark px-4 py-2.5 rounded-lg hover:bg-gray-50'}`}
                >
                  {cat.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Product Grid */}
      <main className="flex-grow">
        
        {/* Top Bar: Active Filters & Sorting */}
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 mr-2">Active:</span>
            {!selectedCategory && !searchQuery && (
              <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">All Products</span>
            )}
            {activeCategoryTitle && (
              <span className="text-sm font-medium bg-brand-cream text-brand-dark border border-brand-creamdark px-3 py-1 rounded-full flex items-center gap-1">
                Category: {activeCategoryTitle}
                <button onClick={() => setSelectedCategory(undefined)} className="hover:text-red-500"><X size={14} /></button>
              </span>
            )}
            {searchQuery && (
              <span className="text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full flex items-center gap-1">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-red-500"><X size={14} /></button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <label className="text-sm text-gray-500">Sort by:</label>
            <select 
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-brand-dark"
            >
              <option value="name-asc">Alphabetical: A-Z</option>
              <option value="name-desc">Alphabetical: Z-A</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
        
        <div className="mb-4 text-sm text-gray-500">
          <p>Showing {displayProducts.length} products</p>
        </div>
        
        {displayProducts.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-dashed border-gray-300">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-xl text-gray-800 font-medium mb-2">No products found</p>
            <p className="text-gray-500 mb-6">We couldn't find any products matching your current filters.</p>
            <button 
              onClick={() => { setSelectedCategory(undefined); setSearchQuery(''); }} 
              className="px-6 py-2 bg-brand-dark text-white rounded-lg font-semibold hover:bg-brand-medium transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProducts.map((product: any) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
