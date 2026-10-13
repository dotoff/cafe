'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Lock, ShoppingBag, CheckCircle, CreditCard, Smartphone } from 'lucide-react'

export default function CheckoutClient({ settings }: { settings: any }) {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCartStore()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    landmark: '',
    pincode: '',
    deliveryDate: '',
    deliverySlot: 'asap',
    specialInstructions: '',
    paymentMethod: 'razorpay',
  })

  const subtotal = getTotal()
  const taxRate = settings?.taxRate ?? 5
  const freeThreshold = settings?.freeShippingThreshold ?? 500
  const flatShipping = settings?.shippingFlatRate ?? 50
  const tax = Math.round(subtotal * (taxRate / 100))
  const shipping = subtotal >= freeThreshold ? 0 : flatShipping
  const total = subtotal + tax + shipping

  const hasRazorpayKey = Boolean(settings?.razorpayKeyId) || Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.customerName.trim()) {
      setError('Please enter your full name')
      return
    }
    if (!formData.customerPhone.trim() || formData.customerPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }
    if (!formData.deliveryAddress.trim()) {
      setError('Please enter your complete delivery address')
      return
    }
    if (!formData.pincode.trim() || formData.pincode.length < 6) {
      setError('Please enter a valid 6-digit pincode')
      return
    }

    setLoading(true)

    try {
      const isLoaded = await loadRazorpayScript()
      if (!isLoaded) {
        throw new Error('Failed to load Razorpay payment SDK. Please check your internet connection.')
      }

      // Create Order on Backend
      const createRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`,
        }),
      })

      const orderData = await createRes.json()
      if (!createRes.ok || !orderData.orderId) {
        throw new Error(orderData.error || 'Failed to initialize Razorpay order')
      }

      // Open Razorpay Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: settings?.storeName || 'Flavourite Cafe & Bakery',
        description: `Fresh Bakery Order (${items.length} items)`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            setLoading(true)
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails: {
                  ...formData,
                  items,
                  subtotal,
                  tax,
                  shipping,
                  total,
                },
              }),
            })

            const verifyData = await verifyRes.json()
            if (!verifyRes.ok || !verifyData.success) {
              throw new Error(verifyData.error || 'Payment signature verification failed')
            }

            clearCart()
            router.push(`/order-success?orderId=${encodeURIComponent(verifyData.orderNumber)}`)
          } catch (verifyErr: any) {
            setError(verifyErr?.message || 'Payment verification failed. Please contact support.')
            setLoading(false)
          }
        },
        prefill: {
          name: formData.customerName,
          contact: formData.customerPhone,
          email: formData.customerEmail || undefined,
        },
        notes: {
          address: formData.deliveryAddress,
          pincode: formData.pincode,
          specialInstructions: formData.specialInstructions || '',
        },
        theme: {
          color: '#3E2723',
        },
        modal: {
          ondismiss: function () {
            setLoading(false)
          },
        },
      }

      const razorpayInstance = new (window as any).Razorpay(options)
      razorpayInstance.on('payment.failed', function (failRes: any) {
        setError(failRes.error?.description || 'Payment was declined or cancelled')
        setLoading(false)
      })
      razorpayInstance.open()
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-brand-cream min-h-screen py-20 px-4">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-10 text-center shadow-sm">
          <ShoppingBag size={56} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-serif text-brand-dark mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 text-sm mb-6">Add delicious freshly baked goodies before checking out.</p>
          <Link
            href="/shop"
            className="inline-block bg-brand-dark text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-medium transition-colors"
          >
            Explore Shop
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-brand-cream min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/cart" className="inline-flex items-center gap-2 text-brand-dark hover:underline font-medium text-sm">
            <ArrowLeft size={16} /> Back to Cart
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200">
            <Lock size={12} className="text-green-600" /> 256-bit Secure Checkout
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif text-brand-dark mb-8">Checkout & Order Confirmation</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Details */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Contact Information */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm">
              <h2 className="text-xl font-serif text-brand-dark mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-dark text-white text-xs flex items-center justify-center font-sans font-bold">1</span>
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-1 focus:ring-brand-dark outline-none text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Phone Number (WhatsApp) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-600 text-sm">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="customerPhone"
                        required
                        value={formData.customerPhone}
                        onChange={handleChange}
                        placeholder="9876543210"
                        className="w-full px-4 py-3 rounded-r-xl border border-gray-200 focus:border-brand-dark focus:ring-1 focus:ring-brand-dark outline-none text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Email Address <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      name="customerEmail"
                      value={formData.customerEmail}
                      onChange={handleChange}
                      placeholder="priya@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-1 focus:ring-brand-dark outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Delivery Address */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm">
              <h2 className="text-xl font-serif text-brand-dark mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-dark text-white text-xs flex items-center justify-center font-sans font-bold">2</span>
                Delivery Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Street Address, Flat / House No., Apartment <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    name="deliveryAddress"
                    required
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    placeholder="Flat 402, Sunshine Heights, Road No. 12, Banjara Hills"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-1 focus:ring-brand-dark outline-none text-sm resize-none"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Landmark <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      placeholder="Near City Center Mall"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-1 focus:ring-brand-dark outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="500034"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-1 focus:ring-brand-dark outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Preferred Delivery Date <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="date"
                      name="deliveryDate"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.deliveryDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-1 focus:ring-brand-dark outline-none text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Delivery Time Slot
                    </label>
                    <select
                      name="deliverySlot"
                      value={formData.deliverySlot}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-1 focus:ring-brand-dark outline-none text-sm bg-white"
                    >
                      <option value="asap">⚡ ASAP / Standard Delivery</option>
                      <option value="morning">🌅 Morning (10:00 AM - 1:00 PM)</option>
                      <option value="afternoon">☀️ Afternoon (1:00 PM - 5:00 PM)</option>
                      <option value="evening">🌙 Evening (5:00 PM - 9:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Special Baking / Delivery Notes <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleChange}
                    placeholder="e.g. 100% Eggless only, Please write 'Happy Birthday Rohit' on cake, Call before arrival"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-dark focus:ring-1 focus:ring-brand-dark outline-none text-sm resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* 3. Secure Payment */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm">
              <h2 className="text-xl font-serif text-brand-dark mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-dark text-white text-xs flex items-center justify-center font-sans font-bold">3</span>
                Payment Method
              </h2>
              
              <div className="p-5 rounded-2xl border-2 border-brand-dark bg-brand-cream/30">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-dark text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <CreditCard size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-bold text-gray-900 text-sm md:text-base">
                        Razorpay Instant & Secure Checkout
                      </span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Lock size={11} /> 100% Secure
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                      Pay instantly with <strong>UPI (Google Pay, PhonePe, Paytm, CRED)</strong>, <strong>Debit & Credit Cards (Visa, Mastercard, RuPay)</strong>, or <strong>Netbanking</strong>.
                    </p>

                    <div className="mt-3 pt-3 border-t border-brand-dark/10 flex flex-wrap items-center gap-2 text-xs font-semibold text-gray-700">
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200">⚡ Google Pay</span>
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200">📱 PhonePe</span>
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200">💳 Cards</span>
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-gray-200">🏦 Netbanking</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm sticky top-24">
              <h2 className="text-xl font-serif text-brand-dark mb-4 pb-3 border-b border-gray-100">
                Order Review ({items.length} {items.length === 1 ? 'item' : 'items'})
              </h2>

              {/* Items List */}
              <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto mb-6 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.variantName && item.variantName !== 'Standard' && `${item.variantName} • `}
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                    </div>
                    <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="space-y-3 border-t border-gray-100 pt-4 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST ({taxRate}%)</span>
                  <span className="font-semibold text-gray-900">₹{tax}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-gray-900">
                    {shipping === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-100 pt-3 text-base">
                  <span className="font-bold text-gray-900">Total Payable</span>
                  <span className="text-2xl font-serif font-bold text-brand-dark">₹{total}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-dark hover:bg-brand-medium text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Opening Razorpay Gateway...</span>
                ) : (
                  <>
                    <CheckCircle size={20} /> Pay ₹{total} via UPI / Card
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <ShieldCheck size={16} className="text-brand-dark" />
                <span>100% Vegetarian • Freshly Baked with Care</span>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}
