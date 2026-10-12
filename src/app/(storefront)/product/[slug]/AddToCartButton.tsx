'use client'

import { useCartStore } from '@/store/cart'
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react'
import { useState } from 'react'

export function AddToCartButton({ product }: { product: any }) {
  const { addItem, items } = useCartStore()
  const [quantity, setQuantity] = useState(1)
  
  const inCart = items.some((i) => i.id === product.id)

  const handleAddToCart = () => {
    addItem({
      productId: product.id || product._id,
      name: product.name,
      price: product.price || 0,
      variantName: 'Standard', // Fallback for AddToCartButton if used outside of variants
      image: product.image,
      quantity,
    })
  }

  return (
    <div>
      <div className="flex items-center gap-6 mb-8">
        <span className="font-semibold text-gray-700">Quantity</span>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors bg-white"
          >
            <Minus size={18} />
          </button>
          <span className="w-12 text-center font-semibold bg-white h-12 flex items-center justify-center border-x border-gray-200">
            {quantity}
          </span>
          <button 
            onClick={() => setQuantity(quantity + 1)}
            className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors bg-white"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <button 
        onClick={handleAddToCart}
        className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 text-lg font-semibold transition-all shadow-md hover:shadow-lg ${
          inCart 
            ? 'bg-brand-purple text-white hover:bg-brand-purple/90' 
            : 'bg-brand-dark text-white hover:bg-brand-medium'
        }`}
      >
        {inCart ? (
          <>
            <Check size={24} /> Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart size={24} /> Add to Cart
          </>
        )}
      </button>
    </div>
  )
}
