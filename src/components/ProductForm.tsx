'use client'

import { useCartStore } from '@/store/cart'
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react'

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
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div>
        <p className="font-semibold text-gray-800 text-lg">{variant.name}</p>
        <p className="text-brand-dark font-bold text-xl">₹{variant.price}</p>
      </div>
      
      <div>
        {qty === 0 ? (
          <button 
            onClick={handleAdd}
            className="px-6 py-2 bg-brand-dark text-white rounded-lg text-sm font-medium hover:bg-brand-medium transition-colors shadow-sm"
          >
            Add
          </button>
        ) : (
          <div className="flex items-center border-2 border-brand-dark rounded-lg overflow-hidden bg-brand-cream text-brand-dark">
            <button 
              onClick={handleDecrement}
              className="w-10 h-10 flex items-center justify-center hover:bg-brand-creamdark transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-10 text-center font-bold text-lg">
              {qty}
            </span>
            <button 
              onClick={handleAdd}
              className="w-10 h-10 flex items-center justify-center hover:bg-brand-creamdark transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}


export function ProductForm({ product }: { product: any }) {
  const { addItem, updateQuantity, removeItem, items } = useCartStore()
  
  const variants = Array.isArray(product.variants) && product.variants.length > 0 
    ? product.variants 
    : [{ id: 'v1', name: 'Standard', price: product.price || 199 }]

  const hasMultipleVariants = variants.length > 1
  
  // Find total items of this product in cart
  const totalInCart = variants.reduce((sum: number, v: any) => {
    const cartItemId = `${product.id || product._id}-${v.name}`
    const cartItem = items.find((i: any) => i.id === cartItemId)
    return sum + (cartItem?.quantity || 0)
  }, 0)

  if (product.inStock === false) {
    return (
      <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 mb-8 text-center">
        <span className="inline-block px-4 py-1.5 bg-gray-900 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          Currently Sold Out
        </span>
        <p className="text-gray-600 text-sm max-w-sm mx-auto">
          This treat is freshly baked in limited batches and is currently sold out for today. Please check back tomorrow!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 mb-8">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        {hasMultipleVariants ? 'Select Options' : 'Purchase'}
      </h3>
      
      <div className="space-y-2 mb-6">
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
      
    </div>
  )
}
