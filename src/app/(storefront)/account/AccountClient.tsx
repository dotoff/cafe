'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  MapPin, 
  Package, 
  Plus, 
  Trash2, 
  LogOut, 
  ArrowRight, 
  CheckCircle, 
  ExternalLink,
  Clock,
  Check
} from 'lucide-react'

export function AccountClient() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [customer, setCustomer] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'addresses' | 'orders' | 'profile'>('addresses')

  // Address form modal state
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [addressLoading, setAddressLoading] = useState(false)
  const [addressError, setAddressError] = useState<string | null>(null)
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    recipientName: '',
    phone: '',
    addressLine1: '',
    landmark: '',
    pincode: '533440',
    city: 'Samalkot',
    isDefault: false,
  })

  // Load customer data
  const loadProfile = async () => {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      if (!data.authenticated) {
        router.push('/login?redirect=/account')
        return
      }
      setCustomer(data.customer)
      setOrders(data.orders || [])
      // prefill address phone with customer's phone
      if (data.customer?.phone) {
        setNewAddress((prev) => ({
          ...prev,
          phone: prev.phone || data.customer.phone,
          recipientName: prev.recipientName || data.customer.name || '',
        }))
      }
    } catch {
      router.push('/login?redirect=/account')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddressError(null)
    setAddressLoading(true)

    try {
      const res = await fetch('/api/customer/address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save address')

      setCustomer((prev: any) => ({ ...prev, addresses: data.addresses }))
      setShowAddressModal(false)
      setNewAddress({
        label: 'Home',
        recipientName: customer?.name || '',
        phone: customer?.phone || '',
        addressLine1: '',
        landmark: '',
        pincode: '533440',
        city: 'Samalkot',
        isDefault: false,
      })
    } catch (err: any) {
      setAddressError(err?.message || 'Error saving address')
    } finally {
      setAddressLoading(false)
    }
  }

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved address?')) return

    try {
      const res = await fetch(`/api/customer/address?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        setCustomer((prev: any) => ({ ...prev, addresses: data.addresses }))
      }
    } catch (e) {
      console.error('Failed to delete address:', e)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'received':
        return <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">Order Placed ⏳</span>
      case 'preparing':
        return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">Baking & Packing 👩‍🍳</span>
      case 'ready':
        return <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-1 rounded-full">Ready for Pickup 🎁</span>
      case 'out_for_delivery':
        return <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full">Out for Delivery 🛵</span>
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full">Delivered 🎉</span>
      case 'cancelled':
        return <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full">Cancelled</span>
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded-full">{status}</span>
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-dark border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-cream/30 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Profile Card Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-cream flex items-center justify-center text-3xl shrink-0 border border-brand-dark/10">
              🌿
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">
                  {customer?.name || 'Valued Guest'}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Check size={12} /> Verified
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                +91 {customer?.phone} {customer?.email && `• ${customer?.email}`}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors px-4 py-2 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 cursor-pointer"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 border-b border-gray-200 pb-2">
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'addresses'
                ? 'bg-brand-dark text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
          >
            <MapPin size={18} />
            <span>Saved Addresses ({customer?.addresses?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-brand-dark text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white'
            }`}
          >
            <Package size={18} />
            <span>My Orders ({orders.length})</span>
          </button>
        </div>

        {/* TAB 1: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Delivery Addresses</h2>
                <p className="text-xs text-gray-500">Your addresses are automatically suggested at checkout for instant 1-click orders.</p>
              </div>
              <button
                onClick={() => setShowAddressModal(true)}
                className="inline-flex items-center gap-2 bg-brand-dark hover:bg-brand-medium text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Address</span>
              </button>
            </div>

            {(!customer?.addresses || customer.addresses.length === 0) ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-gray-200 space-y-3">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto text-xl">
                  📍
                </div>
                <h3 className="font-semibold text-gray-900">No saved addresses yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Add your home or office address in Samalkot, Kakinada, or anywhere in India so you never have to type it again!
                </p>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="inline-flex items-center gap-2 bg-brand-dark text-white text-xs font-semibold px-4 py-2 rounded-xl mt-2 cursor-pointer"
                >
                  <Plus size={14} /> Add First Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customer.addresses.map((addr: any, idx: number) => (
                  <div 
                    key={addr.id || idx}
                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                          {addr.label === 'Home' && '🏠 Home'}
                          {addr.label === 'Work' && '🏢 Work'}
                          {addr.label === 'Other' && '📍 Other'}
                          {!['Home', 'Work', 'Other'].includes(addr.label) && addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            DEFAULT
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-gray-900 text-sm">{addr.recipientName}</h4>
                      <p className="text-xs text-gray-500">{addr.phone}</p>
                      
                      <p className="text-xs text-gray-700 mt-2 leading-relaxed">
                        {addr.addressLine1}
                        {addr.landmark && <span className="text-gray-400 block">Landmark: {addr.landmark}</span>}
                        <span className="block font-semibold mt-1 text-gray-900">
                          {addr.city} - {addr.pincode}
                        </span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-50 flex justify-end">
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Order History</h2>
              <p className="text-xs text-gray-500">Track live orders and view past receipts.</p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-gray-200 space-y-3">
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto text-xl">
                  🛍️
                </div>
                <h3 className="font-semibold text-gray-900">No orders placed yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Treat yourself to freshly handcrafted chocolates or artisanal bakery goodies!
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-brand-dark text-white text-xs font-semibold px-4 py-2 rounded-xl mt-2"
                >
                  Browse Shop →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord: any) => (
                  <div key={ord.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-base text-gray-900">
                            #{ord.orderNumber}
                          </span>
                          {getStatusBadge(ord.status)}
                        </div>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-bold text-brand-dark">₹{ord.total}</span>
                        <span className="text-xs text-gray-400 block">
                          {ord.paymentStatus === 'paid' ? 'Paid Online ☑️' : 'Payment Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-1.5 text-xs text-gray-600">
                      {(ord.items || []).map((item: any, i: number) => (
                        <div key={i} className="flex justify-between">
                          <span>
                            {item.quantity}x {item.product?.name || item.name || 'Bakery Item'}
                            {item.variantName && ` (${item.variantName})`}
                          </span>
                          <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
                      <Link
                        href={`/order-success?orderId=${encodeURIComponent(ord.orderNumber)}`}
                        className="text-xs font-semibold text-brand-dark hover:underline inline-flex items-center gap-1"
                      >
                        <span>View Live Tracker & Receipt</span>
                        <ArrowRight size={14} />
                      </Link>

                      {ord.courierTrackingUrl && (
                        <a
                          href={ord.courierTrackingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 font-medium"
                        >
                          <span>Track Courier</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* MODAL: ADD NEW ADDRESS */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-xl animate-fadeIn">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-lg text-gray-900">Add New Delivery Address</h3>
              <button 
                onClick={() => setShowAddressModal(false)}
                className="text-gray-400 hover:text-gray-700 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {addressError && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200">
                {addressError}
              </div>
            )}

            <form onSubmit={handleAddAddress} className="space-y-4">
              {/* Label */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Address Type</label>
                <div className="flex gap-2">
                  {['Home', 'Work', 'Other'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewAddress((prev) => ({ ...prev, label: type }))}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                        newAddress.label === type
                          ? 'bg-brand-dark text-white border-brand-dark'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {type === 'Home' && '🏠 Home'}
                      {type === 'Work' && '🏢 Work'}
                      {type === 'Other' && '📍 Other'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={newAddress.recipientName}
                    onChange={(e) => setNewAddress((prev) => ({ ...prev, recipientName: e.target.value }))}
                    placeholder="Full Name"
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-dark focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, '') }))}
                    placeholder="10-digit mobile"
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-dark focus:outline-none"
                  />
                </div>
              </div>

              {/* Address Line */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">House / Flat No., Street, Colony</label>
                <textarea
                  required
                  rows={2}
                  value={newAddress.addressLine1}
                  onChange={(e) => setNewAddress((prev) => ({ ...prev, addressLine1: e.target.value }))}
                  placeholder="e.g. Flat 302, Sai Residency, Near Railway Station"
                  className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-dark focus:outline-none"
                />
              </div>

              {/* Landmark & Pincode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={newAddress.landmark}
                    onChange={(e) => setNewAddress((prev) => ({ ...prev, landmark: e.target.value }))}
                    placeholder="Near Temple / School"
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-dark focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress((prev) => ({ ...prev, pincode: e.target.value.replace(/\D/g, '') }))}
                    placeholder="533440"
                    className="w-full text-xs p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-dark focus:outline-none"
                  />
                </div>
              </div>

              {/* Default checkbox */}
              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(e) => setNewAddress((prev) => ({ ...prev, isDefault: e.target.checked }))}
                  className="rounded border-gray-300 text-brand-dark focus:ring-brand-dark"
                />
                <span>Set as default delivery address</span>
              </label>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-3 text-xs font-semibold border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addressLoading}
                  className="flex-1 py-3 text-xs font-semibold bg-brand-dark hover:bg-brand-medium text-white rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {addressLoading ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
