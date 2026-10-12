'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, PackageCheck, ChefHat, Bike, CheckCircle2, Clock, MessageCircle, AlertCircle } from 'lucide-react'

const STATUS_STEPS = [
  { id: 'new', label: 'Order Placed', icon: Clock, desc: 'We have received your order' },
  { id: 'confirmed', label: 'Confirmed', icon: PackageCheck, desc: 'Payment verified & order accepted' },
  { id: 'preparing', label: 'In the Oven', icon: ChefHat, desc: 'Freshly baking in our kitchen' },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: Bike, desc: 'With the rider on the way' },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle2, desc: 'Enjoy your sweet treats!' },
]

export default function TrackOrderClient({ settings }: { settings: any }) {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('id') || ''

  const [query, setQuery] = useState(initialQuery)
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (searchVal: string) => {
    if (!searchVal.trim()) return
    setLoading(true)
    setError(null)
    setOrder(null)

    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(searchVal.trim())}`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Order not found')
      }

      setOrder(data.order)
    } catch (err: any) {
      setError(err?.message || 'Failed to find order')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery)
    }
  }, [initialQuery])

  const currentStatusIndex = order ? STATUS_STEPS.findIndex((s) => s.id === order.orderStatus) : -1
  const activeStep = currentStatusIndex === -1 ? 0 : currentStatusIndex

  const whatsappNumber = settings?.whatsappNumber || '917013205977'

  return (
    <div className="bg-brand-cream min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest text-brand-dark uppercase bg-brand-creamdark px-3 py-1 rounded-full">
            Live Order Tracking
          </span>
          <h1 className="text-3xl md:text-5xl font-serif text-brand-dark mt-3 mb-3">
            Track Your Fresh Goodies
          </h1>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Enter your Order ID (e.g. FLV-261011-4829) or 10-digit mobile number to see baking & delivery updates.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-3xl shadow-sm mb-8 border border-gray-100">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch(query)
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Order Number (FLV-...) or Mobile Number"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:border-brand-dark focus:ring-1 focus:ring-brand-dark outline-none text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-dark hover:bg-brand-medium text-white px-8 py-3.5 rounded-2xl font-bold transition-all disabled:opacity-50 shrink-0 text-sm shadow-md"
            >
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </form>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm flex items-center gap-3 mb-8">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Results Card */}
        {order && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 animate-in fade-in duration-300">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-gray-100">
              <div>
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Order ID</span>
                <h3 className="text-xl font-bold text-gray-900 font-mono">#{order.orderNumber}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Placed by {order.customerName} • {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold capitalize">
                  {order.orderStatus === 'preparing' ? '🧁 Baking in Kitchen' : order.orderStatus}
                </span>
              </div>
            </div>

            {/* Stepper */}
            <div className="py-8">
              <div className="relative">
                {/* Horizontal progress bar for desktop */}
                <div className="hidden sm:block absolute top-6 left-6 right-6 h-1 bg-gray-100 -z-0">
                  <div
                    className="h-full bg-brand-dark transition-all duration-500"
                    style={{ width: `${(activeStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                  {STATUS_STEPS.map((step, idx) => {
                    const Icon = step.icon
                    const isDone = idx <= activeStep
                    const isCurrent = idx === activeStep

                    return (
                      <div key={step.id} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-2">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${
                            isDone
                              ? 'bg-brand-dark text-white'
                              : 'bg-gray-100 text-gray-400 border border-gray-200'
                          } ${isCurrent ? 'ring-4 ring-brand-cream ring-offset-2' : ''}`}
                        >
                          <Icon size={20} />
                        </div>
                        <div className="sm:max-w-[120px]">
                          <p className={`text-xs font-bold ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                          <p className="text-[11px] text-gray-500 hidden sm:block mt-0.5 leading-tight">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-sm">
              <p className="text-xs uppercase font-bold text-gray-400 mb-2">Items in this order</p>
              <div className="divide-y divide-gray-200/60">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="py-2 flex justify-between text-xs">
                    <span className="font-medium text-gray-800">
                      {item.quantity} × {item.name} {item.variantName && item.variantName !== 'Standard' ? `(${item.variantName})` : ''}
                    </span>
                    <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between text-xs font-bold text-gray-900">
                <span>Total Amount</span>
                <span>₹{order.total}</span>
              </div>
            </div>

            {/* Contact Baker CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hi!%20I'm%20checking%20the%20status%20of%20Order%20${order.orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-sm shadow-md"
              >
                <MessageCircle size={18} /> Chat with Bakery on WhatsApp
              </a>
              <Link
                href="/shop"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-semibold flex items-center justify-center transition-colors text-sm text-center"
              >
                Back to Shop
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
