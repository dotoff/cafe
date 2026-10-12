'use client'

import { useCartStore } from '@/store/cart'
import Link from 'next/link'
import { Heart, ShoppingCart, X, Check, Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { createPortal } from 'react-dom'

interface ProductCardProps {
  product: any
}

// A sub-component for each variant row so it can track its own cart quantity cleanly
function VariantRow({ product, variant, items, addItem, updateQuantity, removeItem }: any) {
  const cartItemId = `${product.id || product._id}-${variant.name}`
  const cartItem = items.find((i: any) => i.id === cartItemId)
  const qty = cartItem?.quantity || 0

  const handleAdd = () => {
    if (qty === 0) {
      addItem({
        productId: product.id || product._id,
        name: product.name,
        price: variant.price,
        variantName: variant.name,
        image: product.image,
        quantity: 1,
      })
    } else {
      updateQuantity(cartItemId, qty + 1)
    }
  }

  const handleDecrement = () => {
    if (qty > 1) {
      updateQuantity(cartItemId, qty - 1)
    } else if (qty === 1) {
      removeItem(cartItemId)
    }
  }

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="font-semibold text-gray-800">{variant.name}</p>
        <p className="text-brand-dark font-bold">₹{variant.price}</p>
      </div>
      
      <div>
        {qty === 0 ? (
          <button 
            onClick={handleAdd}
            className="px-4 py-2 bg-brand-dark text-white rounded-lg text-sm font-medium hover:bg-brand-medium transition-colors"
          >
            Add
          </button>
        ) : (
          <div className="flex items-center border border-brand-dark rounded-lg overflow-hidden bg-brand-cream text-brand-dark">
            <button 
              onClick={handleDecrement}
              className="w-8 h-8 flex items-center justify-center hover:bg-brand-creamdark transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-8 text-center font-bold text-sm">
              {qty}
            </span>
            <button 
              onClick={handleAdd}
              className="w-8 h-8 flex items-center justify-center hover:bg-brand-creamdark transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, updateQuantity, removeItem, items } = useCartStore()
  const [isWishlist, setIsWishlist] = useState(false)
  const [showModal, setShowModal] = useState(false)
  
  const variants = Array.isArray(product.variants) && product.variants.length > 0 
    ? product.variants 
    : [{ id: 'default', name: 'Standard', price: product.price || 0 }]
    
  const displayPrice = variants[0].price
  const hasMultipleVariants = variants.length > 1
  
  const imageUrl = product.image && typeof product.image === 'object' && product.image.url ? product.image.url : null
  const productSlug = product.slug || product.id || product._id

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col relative">
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-cream flex items-center justify-center p-6">
          {product.isBestSeller && (
            <span className="absolute top-3 left-3 z-10 bg-brand-gold text-brand-dark text-xs px-2.5 py-1 rounded-full font-bold shadow-sm">
              ★ Best Seller
            </span>
          )}
          {product.inStock === false && (
            <span className="absolute top-3 left-3 z-10 bg-gray-900 text-white text-[11px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">
              Sold Out
            </span>
          )}

          <button 
            onClick={(e) => { e.preventDefault(); setIsWishlist(!isWishlist) }}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:text-red-500 transition-colors"
          >
            <Heart size={16} className={isWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
          </button>
          
          <Link href={`/product/${productSlug}`} className="w-full h-full flex items-center justify-center">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={product.name}
                className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ${product.inStock === false ? 'grayscale opacity-60' : ''}`}
              />
            ) : (
              <div className="text-6xl">🍫</div>
            )}
          </Link>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <Link href={`/product/${productSlug}`}>
            <h3 className="font-semibold text-gray-900 mb-1 hover:text-brand-dark leading-tight flex items-center gap-1.5">
              {product.isEggless !== false && (
                <span title="100% Vegetarian / Eggless" className="w-2 h-2 rounded-full bg-green-600 inline-block shrink-0"></span>
              )}
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mb-4">{hasMultipleVariants ? `${variants.length} Options available` : variants[0].name}</p>
          
          <div className="mt-auto flex items-center justify-between">
            <p className="text-lg font-bold text-gray-900">
              {hasMultipleVariants && <span className="text-xs text-gray-500 font-normal mr-1">from</span>}
              ₹{displayPrice}
            </p>
            {product.inStock === false ? (
              <span className="px-3 py-1.5 bg-gray-100 text-gray-400 rounded-lg text-xs font-semibold cursor-not-allowed">
                Sold Out
              </span>
            ) : (
              <button 
                onClick={(e) => {
                  e.preventDefault()
                  setShowModal(true)
                }}
                className="px-4 py-2 bg-brand-dark text-white rounded-lg text-sm font-medium hover:bg-brand-medium transition-colors flex items-center gap-2"
              >
                {hasMultipleVariants ? 'Select' : 'Add'} <Plus size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {showModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100/80 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors backdrop-blur-md"
            >
              <X size={16} />
            </button>
            
            <div className="flex h-40 bg-brand-cream items-center justify-center p-4 relative shrink-0 border-b border-brand-creamdark">
              {imageUrl ? (
                <img src={imageUrl} alt={product.name} className="h-full object-contain mix-blend-multiply" />
              ) : (
                <div className="text-6xl">🍫</div>
              )}
            </div>
            
            <div className="p-6 overflow-y-auto">
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-6">Choose your variants below:</p>
              
              <div className="space-y-1 mb-6 border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                {variants.map((v: any, idx: number) => (
                  <VariantRow 
                    key={v.id || idx} 
                    product={product} 
                    variant={v} 
                    items={items} 
                    addItem={addItem} 
                    updateQuantity={updateQuantity} 
                    removeItem={removeItem} 
                  />
                ))}
              </div>
              
              <button 
                onClick={() => setShowModal(false)}
                className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2 text-base font-semibold transition-all bg-gray-900 text-white hover:bg-gray-800"
              >
                Done
              </button>

              <Link
                href={`/product/${productSlug}`}
                onClick={() => setShowModal(false)}
                className="block text-center text-xs text-brand-dark hover:underline mt-3 font-medium"
              >
                View Full Product Details & Ingredients →
              </Link>
            </div>
            
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
