'use client'

import { useCartStore } from '@/store/cart'
import Link from 'next/link'
import { ArrowRight, Trash2, Minus, Plus, ShoppingBag } from 'lucide-react'

export default function CartClient({ settings }: { settings: any }) {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore()

  const subtotal = getTotal()
  const taxRate = settings?.taxRate ?? 5
  const freeThreshold = settings?.freeShippingThreshold ?? 500
  const flatShipping = settings?.shippingFlatRate ?? 50
  const whatsappNumber = settings?.whatsappNumber || '917013205977'

  const tax = Math.round(subtotal * (taxRate / 100))
  const shipping = subtotal >= freeThreshold ? 0 : flatShipping
  const total = subtotal + tax + shipping

  const handleCheckout = () => {
    let message = `*New Order from ${settings?.storeName || 'Flavourite'}*%0A%0A`
    message += `*Items:*%0A`
    
    items.forEach((item, index) => {
      const variantText = item.variantName && item.variantName !== 'Standard' ? ` - ${item.variantName}` : ''
      message += `${index + 1}. ${item.name}${variantText} - ${item.quantity} x ₹${item.price} = ₹${item.quantity * item.price}%0A`
    })

    message += `%0A*Subtotal:* ₹${subtotal}%0A`
    message += `*Tax (${taxRate}%):* ₹${tax}%0A`
    if (shipping > 0) message += `*Shipping:* ₹${shipping}%0A`
    message += `*Total Amount:* ₹${total}%0A%0A`
    message += `Please confirm my order and share payment details.`

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`

    window.open(whatsappUrl, '_blank')
  }

  if (items.length === 0) {
    return (
      <div className="bg-brand-cream min-h-screen py-20 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-12 text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-serif text-brand-dark mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any sweet treats yet.</p>
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 bg-brand-dark text-white px-8 py-4 rounded-full font-semibold hover:bg-brand-medium transition-all"
          >
            Start Shopping <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-brand-cream min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-brand-dark mb-8">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-grow">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-brand-dark text-white text-sm font-semibold">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right pr-4">Total</div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center">
                    
                    <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                      <div className="w-20 h-20 bg-brand-cream rounded-xl flex items-center justify-center text-3xl overflow-hidden shrink-0">
                        {item.image && typeof item.image === 'object' && item.image.url ? (
                           <img src={item.image.url} alt={item.name} className="w-full h-full object-cover" />
                        ) : '🍫'}
                      </div>
                      <div>
                        <Link href={`/product/${item.productId}`} className="font-semibold text-gray-900 hover:text-brand-dark transition-colors">{item.name}</Link>
                        {item.variantName && item.variantName !== 'Standard' && (
                          <p className="text-sm text-gray-500 mt-1">{item.variantName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 flex md:justify-center font-medium text-gray-900">
                      <span className="md:hidden text-gray-500 mr-2">Price:</span> ₹{item.price}
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 flex md:justify-center">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button 
                          onClick={() => {
                            if (item.quantity > 1) {
                              updateQuantity(item.id, item.quantity - 1)
                            } else {
                              removeItem(item.id)
                            }
                          }}
                          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-semibold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center pr-0 md:pr-4">
                      <span className="md:hidden text-gray-500">Total:</span> 
                      <span className="font-bold text-brand-dark text-lg">₹{item.price * item.quantity}</span>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="ml-4 text-gray-400 hover:text-red-500 p-2"
                        title="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-96 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-8 sticky top-24">
              <h3 className="text-xl font-serif text-brand-dark mb-6 pb-4 border-b">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax ({taxRate}%)</span>
                  <span className="font-medium text-gray-900">₹{tax}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">
                    {shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${shipping}`}
                  </span>
                </div>
                {shipping > 0 && subtotal > 0 && (
                  <p className="text-xs text-brand-dark text-right">Add ₹{(freeThreshold - subtotal).toLocaleString()} more for free shipping!</p>
                )}
              </div>
              
              <div className="border-t pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="text-2xl font-bold text-brand-dark">₹{total}</span>
                </div>
              </div>
              
              <Link
                href="/checkout"
                className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-medium transition-colors shadow-lg text-center"
              >
                Proceed to Checkout <ArrowRight size={18} />
              </Link>

              <button 
                onClick={handleCheckout}
                className="w-full mt-3 bg-white border border-green-600 text-green-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-50 transition-colors text-sm"
              >
                💬 Quick Order via WhatsApp
              </button>
              
              <Link href="/shop" className="block text-center mt-6 text-brand-dark font-medium hover:underline">
                ← Continue Shopping
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
