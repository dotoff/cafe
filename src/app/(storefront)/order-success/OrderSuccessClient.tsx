'use client'

import React from 'react'
import Link from 'next/link'
import { CheckCircle2, Receipt, ArrowRight, PackageCheck } from 'lucide-react'

export default function OrderSuccessClient({ order, settings }: { order: any; settings: any }) {
  const whatsappNumber = settings?.whatsappNumber || '917013205977'
  const storeName = settings?.storeName || 'Flavourite'

  const slotLabels: Record<string, string> = {
    morning: 'Morning (10:00 AM - 1:00 PM)',
    afternoon: 'Afternoon (1:00 PM - 5:00 PM)',
    evening: 'Evening (5:00 PM - 9:00 PM)',
    asap: 'ASAP / Standard Delivery',
  }
  const slotName = order.deliverySlot ? (slotLabels[order.deliverySlot] || order.deliverySlot) : 'Standard'
  const formattedDate = order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null

  return (
    <div className="bg-brand-cream min-h-screen py-12 px-4 print:bg-white print:py-0 print:px-0">
      <div className="max-w-3xl mx-auto print:max-w-full">
        
        {/* Success Header (Hidden when printing packing slip) */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm text-center mb-8 border border-green-100 print:hidden">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle2 size={44} />
          </div>
          <span className="text-xs font-bold tracking-widest text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full">
            🎉 Payment Successful & Verified
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-brand-dark mt-3 mb-2">
            Thank you, {order.customerName}!
          </h1>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Your payment has been received via Razorpay and your order is confirmed with our bakery!
          </p>
          <div className="inline-flex items-center gap-2 mt-4 bg-brand-cream px-5 py-2.5 rounded-2xl border border-brand-dark/20 text-brand-dark font-mono font-bold text-lg">
            <span>#{order.orderNumber}</span>
          </div>
          {order.razorpayPaymentId && (
            <p className="text-xs text-gray-500 mt-2 font-mono">
              Razorpay Ref: <span className="text-gray-700 font-semibold">{order.razorpayPaymentId}</span>
            </p>
          )}
        </div>

        {/* Kitchen Preparation & Live Order Tracker (Hidden when printing packing slip) */}
        <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-3xl p-8 shadow-sm mb-8 border border-emerald-200 print:hidden">
          <h2 className="text-xl font-serif text-brand-dark mb-2 flex items-center gap-2">
            <span>🧁</span> Order Confirmed & In The Kitchen
          </h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            We received your payment of <strong className="text-emerald-700 font-bold">₹{order.total}</strong> via Razorpay. Our bakery team is preparing your goodies fresh to order.
          </p>

          {/* Visual Order Progress Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4 rounded-2xl border border-emerald-100 mb-6 text-center text-xs">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/60">
              <span className="font-bold text-emerald-800 block text-sm">✅ Payment Verified</span>
              <span className="text-emerald-600 font-medium">₹{order.total} Paid via Razorpay</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60">
              <span className="font-bold text-amber-800 block text-sm">🧁 Freshly Baking</span>
              <span className="text-amber-700 font-medium">Sent to Flavourite Kitchen</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200/60">
              <span className="font-bold text-blue-800 block text-sm">🛵 Out For Delivery</span>
              <span className="text-blue-700 font-medium">{slotName}</span>
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
        </div>

        {/* Order Receipt Details */}
        <div className="bg-white rounded-3xl p-8 shadow-sm print:shadow-none print:p-0 print:border-none">
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
