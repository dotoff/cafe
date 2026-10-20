'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle2, Receipt, ArrowRight, PackageCheck, MessageCircle } from 'lucide-react'

export default function OrderSuccessClient({
  order: initialOrder,
  orderNumber,
  settings,
}: {
  order: any
  orderNumber?: string
  settings: any
}) {
  const [order, setOrder] = useState<any>(initialOrder)

  useEffect(() => {
    if (!order && typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('flavourite_last_order')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (!orderNumber || parsed.orderNumber === orderNumber) {
            setOrder(parsed)
          }
        }
      } catch (e) {
        // Ignore sessionStorage errors
      }
    }
  }, [order, orderNumber])

  const whatsappNumber = settings?.whatsappNumber || '917013205977'
  const storeName = settings?.storeName || 'Flavourite'

  if (!order) {
    return (
      <div className="bg-brand-cream min-h-screen py-20 px-4">
        <div className="max-w-md mx-auto bg-white border border-gray-100 rounded-3xl p-10 text-center shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            ✓
          </div>
          <h1 className="text-2xl font-serif text-brand-dark mb-2">Order Confirmed!</h1>
          {orderNumber && (
            <p className="font-mono font-bold text-brand-dark mb-2">#{orderNumber}</p>
          )}
          <p className="text-gray-600 text-sm mb-6">
            Thank you for shopping with Flavourite. Your payment was verified and we are preparing your order!
          </p>
          <Link
            href="/shop"
            className="inline-block bg-brand-dark text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-medium transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  const slotLabels: Record<string, string> = {
    morning: 'Morning (10:00 AM - 1:00 PM)',
    afternoon: 'Afternoon (1:00 PM - 5:00 PM)',
    evening: 'Evening (5:00 PM - 9:00 PM)',
    asap: 'ASAP / Standard Delivery',
  }
  const slotName = order.deliverySlot ? (slotLabels[order.deliverySlot] || order.deliverySlot) : 'Standard Delivery'
  const formattedDate = order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null

  const status = order.orderStatus || 'confirmed'
  const isPreparing = ['preparing', 'out_for_delivery', 'delivered'].includes(status)
  const isOutForDelivery = ['out_for_delivery', 'delivered'].includes(status)
  const isDelivered = status === 'delivered'

  const statusDisplayLabels: Record<string, string> = {
    new: 'Order Placed',
    confirmed: 'Confirmed',
    preparing: 'Preparing in Kitchen',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  }

  return (
    <div className="bg-brand-cream min-h-screen py-12 px-4 print:bg-white print:py-0 print:px-0">
      <div className="max-w-3xl mx-auto print:max-w-full">
        
        {/* Success Header (Hidden when printing packing slip) */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm text-center mb-8 border border-gray-100 print:hidden">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle2 size={44} />
          </div>
          <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase bg-emerald-50 border border-emerald-200/60 px-3.5 py-1 rounded-full">
            🎉 Payment Successful & Confirmed
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-brand-dark mt-3 mb-2">
            Thank you, {order.customerName}!
          </h1>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Your payment has been received via Razorpay and your order is officially confirmed with our bakery!
          </p>
          <div className="inline-flex items-center gap-2 mt-4 bg-brand-cream px-5 py-2.5 rounded-2xl border border-brand-creamdark text-brand-dark font-mono font-bold text-lg shadow-xs">
            <span>#{order.orderNumber}</span>
          </div>
          {order.razorpayPaymentId && (
            <p className="text-xs text-gray-500 mt-2 font-mono">
              Razorpay Ref: <span className="text-gray-700 font-semibold">{order.razorpayPaymentId}</span>
            </p>
          )}
        </div>

        {/* Kitchen Preparation & Live Order Tracker (Hidden when printing packing slip) */}
        <div className="bg-gradient-to-br from-white via-emerald-50/20 to-emerald-50/40 rounded-3xl p-8 shadow-sm mb-8 border border-emerald-100 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <h2 className="text-xl font-serif text-brand-dark flex items-center gap-2">
              <span>🧁</span>
              {isDelivered
                ? 'Order Delivered!'
                : isOutForDelivery
                ? 'Order Out For Delivery'
                : isPreparing
                ? 'Freshly Baking in Our Kitchen'
                : 'Order Confirmed & Queued for Kitchen'}
            </h2>
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200/60">
              Current Status: {statusDisplayLabels[status] || 'Confirmed'}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            We received your payment of <strong className="text-emerald-700 font-bold">₹{order.total}</strong> via Razorpay. Your order has been sent to our kitchen queue and will be baked fresh for your delivery slot.
          </p>

          {/* Visual 3-Step Order Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 bg-white/80 p-4 rounded-2xl border border-emerald-100/60 mb-6 text-left text-xs">
            {/* Step 1: Payment & Confirmation (Active/Completed immediately) */}
            <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/80 shadow-xs relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  Step 1 • Completed
                </span>
                <span className="text-emerald-600 font-bold">✓</span>
              </div>
              <span className="font-bold text-gray-900 block text-sm">Payment Verified</span>
              <span className="text-emerald-700 font-medium block mt-0.5">₹{order.total} Paid via Razorpay</span>
            </div>

            {/* Step 2: Kitchen Preparation */}
            <div
              className={`p-4 rounded-xl transition-all ${
                isPreparing
                  ? 'bg-amber-50/80 border border-amber-200 shadow-xs'
                  : 'bg-gray-50/70 border border-dashed border-gray-200 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isPreparing
                      ? 'text-amber-800 bg-amber-100'
                      : 'text-gray-500 bg-gray-200/70'
                  }`}
                >
                  {isOutForDelivery ? 'Step 2 • Completed' : isPreparing ? 'Step 2 • Active Now' : 'Step 2 • Up Next'}
                </span>
                <span>🧁</span>
              </div>
              <span className={`font-bold block text-sm ${isPreparing ? 'text-amber-950' : 'text-gray-700'}`}>
                {isPreparing ? 'Freshly Baking' : 'Kitchen Preparation'}
              </span>
              <span className={`font-medium block mt-0.5 ${isPreparing ? 'text-amber-700' : 'text-gray-500'}`}>
                {isPreparing ? 'In the Flavourite oven' : 'Queued for fresh baking'}
              </span>
            </div>

            {/* Step 3: Delivery Slot / Dispatch */}
            <div
              className={`p-4 rounded-xl transition-all ${
                isOutForDelivery
                  ? 'bg-blue-50/80 border border-blue-200 shadow-xs'
                  : 'bg-gray-50/70 border border-dashed border-gray-200 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isOutForDelivery
                      ? 'text-blue-800 bg-blue-100'
                      : 'text-gray-500 bg-gray-200/70'
                  }`}
                >
                  {isDelivered ? 'Step 3 • Delivered' : isOutForDelivery ? 'Step 3 • In Transit' : 'Step 3 • Scheduled'}
                </span>
                <span>{isOutForDelivery ? '🛵' : '🗓️'}</span>
              </div>
              <span className={`font-bold block text-sm ${isOutForDelivery ? 'text-blue-950' : 'text-gray-700'}`}>
                {isDelivered ? 'Delivered' : isOutForDelivery ? 'Out For Delivery' : 'Scheduled Delivery'}
              </span>
              <span className={`font-medium block mt-0.5 ${isOutForDelivery ? 'text-blue-700' : 'text-gray-500'}`}>
                {formattedDate ? `${formattedDate} • ` : ''}{slotName}
              </span>
            </div>
          </div>

          {/* Track Order Link */}
          <Link
            href={`/track-order?id=${encodeURIComponent(order.orderNumber)}`}
            className="w-full bg-brand-dark hover:bg-brand-medium text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-md text-center"
          >
            <PackageCheck size={22} />
            <span>Track Live Order Status</span>
            <ArrowRight size={18} />
          </Link>

          {/* Instant WhatsApp Updates (Free Direct Connection) */}
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              `Hi ${storeName}! 🧁 I just placed order #${order.orderNumber} for ${order.customerName} (₹${order.total}). Please send me live baking and delivery updates here!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full mt-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3.5 px-6 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all shadow-sm text-center text-sm"
          >
            <MessageCircle size={20} />
            <span>Get Live Updates on WhatsApp</span>
          </a>
        </div>

        {/* Order Receipt Details */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 print:shadow-none print:p-0 print:border-none">
          {/* Print-Only Official Slip Header */}
          <div className="hidden print:block pb-4 mb-4 border-b-2 border-black">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-serif font-bold text-black">🌿 {storeName}</h1>
                <p className="text-xs uppercase tracking-wider text-gray-700">Bakery & Cafe • Delivery Packing Slip</p>
                <p className="text-xs text-gray-600 mt-0.5">Call / WhatsApp: +{whatsappNumber}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase text-gray-500 block">Order Reference</span>
                <span className="text-xl font-bold font-mono text-black">#{order.orderNumber}</span>
                <p className="text-xs text-gray-600 mt-0.5">Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 print:hidden">
            <h3 className="text-lg font-serif text-brand-dark flex items-center gap-2">
              <Receipt size={20} className="text-gray-400" /> Order Receipt & Packing Slip
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition-colors print:hidden"
              >
                🖨️ Print Slip / Label
              </button>
              <span className="text-xs text-gray-500 font-mono">
                Status: <span className="font-bold text-amber-600 capitalize">{order.orderStatus || 'New'}</span>
              </span>
            </div>
          </div>

          {/* Customer & Delivery Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-6 bg-gray-50 p-4 rounded-2xl">
            <div>
              <p className="text-xs uppercase font-bold text-gray-400 mb-1">Customer</p>
              <p className="font-semibold text-gray-900">{order.customerName}</p>
              <p className="text-xs text-gray-500">{order.customerPhone}</p>
              {order.customerEmail && <p className="text-xs text-gray-500">{order.customerEmail}</p>}
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-gray-400 mb-1">Delivery Address</p>
              <p className="text-gray-800 text-xs leading-relaxed">{order.deliveryAddress}</p>
              {order.landmark && <p className="text-xs text-gray-500">Landmark: {order.landmark}</p>}
              <p className="text-xs text-gray-500">Pincode: {order.pincode}</p>
            </div>
            {(formattedDate || order.deliverySlot) && (
              <div className="md:col-span-2 border-t border-gray-200/60 pt-3 flex flex-wrap gap-6">
                {formattedDate && (
                  <div>
                    <span className="text-xs uppercase font-bold text-gray-400 block">Requested Delivery Date</span>
                    <span className="font-semibold text-gray-900 text-xs">{formattedDate}</span>
                  </div>
                )}
                {order.deliverySlot && (
                  <div>
                    <span className="text-xs uppercase font-bold text-gray-400 block">Time Slot</span>
                    <span className="font-semibold text-gray-900 text-xs">{slotName}</span>
                  </div>
                )}
              </div>
            )}
            {order.specialInstructions && (
              <div className="md:col-span-2 border-t border-gray-200/60 pt-2">
                <span className="text-xs uppercase font-bold text-gray-400 block">Kitchen Instructions</span>
                <span className="text-xs text-amber-800 bg-amber-50 px-2 py-1 rounded-md inline-block font-medium mt-1">
                  📝 {order.specialInstructions}
                </span>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="divide-y divide-gray-100 mb-6">
            {order.items?.map((item: any, idx: number) => (
              <div key={idx} className="py-3 flex items-center justify-between text-sm">
                <div>
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

          {/* Financial Breakdown */}
          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>GST</span>
              <span className="font-medium text-gray-900">₹{order.tax || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-medium text-gray-900">
                {order.shipping === 0 ? <span className="text-green-600">FREE</span> : `₹${order.shipping}`}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-gray-100 pt-3 text-base">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-xl font-bold font-serif text-brand-dark">₹{order.total}</span>
            </div>
          </div>

          <div className="mt-8 text-center border-t border-gray-100 pt-6 print:hidden">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-brand-dark hover:text-brand-medium font-semibold text-sm"
            >
              ← Continue Shopping at Flavourite
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
