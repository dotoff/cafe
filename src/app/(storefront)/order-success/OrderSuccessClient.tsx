'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, MessageCircle, Copy, Check, MapPin, Receipt, ArrowRight, Clock, QrCode } from 'lucide-react'

export default function OrderSuccessClient({ order, settings }: { order: any; settings: any }) {
  const [copied, setCopied] = useState(false)

  const whatsappNumber = settings?.whatsappNumber || '917013205977'
  const upiId = settings?.upiId || '7013205977@upi'
  const storeName = settings?.storeName || 'Flavourite'

  const slotLabels: Record<string, string> = {
    morning: 'Morning (10:00 AM - 1:00 PM)',
    afternoon: 'Afternoon (1:00 PM - 5:00 PM)',
    evening: 'Evening (5:00 PM - 9:00 PM)',
    asap: 'ASAP / Standard Delivery',
  }
  const slotName = order.deliverySlot ? (slotLabels[order.deliverySlot] || order.deliverySlot) : 'Standard'
  const formattedDate = order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null

  // Pre-fill WhatsApp message
  let waMessage = `*Order Confirmation - ${storeName}*%0A%0A`
  waMessage += `*Order ID:* ${order.orderNumber}%0A`
  waMessage += `*Name:* ${order.customerName}%0A`
  waMessage += `*Phone:* ${order.customerPhone}%0A`
  waMessage += `*Address:* ${order.deliveryAddress}, ${order.pincode}%0A`
  if (formattedDate) waMessage += `*Preferred Date:* ${formattedDate}%0A`
  if (order.deliverySlot) waMessage += `*Preferred Slot:* ${slotName}%0A`
  if (order.specialInstructions) waMessage += `*Notes:* ${order.specialInstructions}%0A`
  waMessage += `%0A*Total Amount:* ₹${order.total}%0A`
  waMessage += `*Payment Method:* ${order.paymentMethod === 'razorpay' ? 'Razorpay Online' : 'UPI / WhatsApp Pay'}%0A%0A`
  waMessage += `Please confirm my order and share updates! 🙏`

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${waMessage}`

  // Standard UPI URI
  const upiPaymentUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(storeName)}&am=${order.total}&cu=INR&tn=${encodeURIComponent(`Order ${order.orderNumber}`)}`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiPaymentUri)}`

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="bg-brand-cream min-h-screen py-12 px-4 print:bg-white print:py-0 print:px-0">
      <div className="max-w-3xl mx-auto print:max-w-full">
        
        {/* Success Header (Hidden when printing packing slip) */}
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm text-center mb-8 border border-green-100 print:hidden">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle2 size={44} />
          </div>
          <span className="text-xs font-bold tracking-widest text-green-700 uppercase bg-green-50 px-3 py-1 rounded-full">
            Order Received
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-brand-dark mt-3 mb-2">
            Thank you, {order.customerName}!
          </h1>
          <p className="text-gray-600 text-sm max-w-md mx-auto">
            Your order has been recorded into our bakery queue. Order Number:
          </p>
          <div className="inline-block mt-3 bg-brand-cream px-5 py-2 rounded-2xl border border-brand-dark/20 text-brand-dark font-mono font-bold text-lg">
            #{order.orderNumber}
          </div>
        </div>

        {/* Payment & Confirmation Next Steps (Hidden when printing packing slip) */}
        <div className="bg-gradient-to-br from-white to-green-50/50 rounded-3xl p-8 shadow-sm mb-8 border border-green-200 print:hidden">
          <h2 className="text-xl font-serif text-brand-dark mb-2 flex items-center gap-2">
            <span>✨</span> Next Step: Pay & Confirm on WhatsApp
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            To start baking your order immediately, pay <strong>₹{order.total}</strong> via UPI and click the button below to confirm with our kitchen team.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-white p-6 rounded-2xl border border-gray-100 mb-6">
            {/* Left: UPI details */}
            <div>
              <p className="text-xs uppercase font-bold text-gray-400 mb-1">Scan or Pay via any UPI App</p>
              <p className="text-sm font-semibold text-gray-800 mb-3">Google Pay • PhonePe • Paytm • BHIM</p>
              
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-sm text-gray-800 truncate">{upiId}</span>
                <button
                  onClick={copyUpi}
                  className="bg-brand-dark text-white text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 shrink-0 hover:bg-brand-medium transition-colors"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy UPI'}
                </button>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                Total to Pay: <strong className="text-brand-dark text-sm">₹{order.total}</strong>
              </p>
            </div>

            {/* Right: QR Code */}
            <div className="flex flex-col items-center justify-center p-3 bg-brand-cream/40 rounded-xl border border-brand-cream">
              <img
                src={qrCodeUrl}
                alt="UPI Payment QR Code"
                className="w-40 h-40 rounded-lg shadow-sm border border-white"
              />
              <span className="text-[11px] text-gray-500 mt-2 font-medium">Scan with your phone to pay</span>
            </div>
          </div>

          {/* Primary WhatsApp Action */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg text-center"
          >
            <MessageCircle size={22} />
            <span>Confirm Order on WhatsApp</span>
            <ArrowRight size={18} />
          </a>
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
