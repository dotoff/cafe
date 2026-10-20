'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  Bike,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
  FileText,
  AlertTriangle,
  ExternalLink,
  MessageCircle,
  Printer,
  ChevronRight,
} from 'lucide-react'

export function BakeryDashboard() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'preparing' | 'out_for_delivery'>('all')
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setRefreshing(true)
      const res = await fetch('/api/admin/dashboard-stats', { cache: 'no-store' })
      const data = await res.json()
      if (res.ok && data.stats) {
        setStats(data.stats)
        setError(null)
      } else {
        setError(data.error || 'Failed to load stats')
      }
    } catch (err: any) {
      setError(err?.message || 'Error connecting to server')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleQuickStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId)
      const res = await fetch('/api/admin/orders/quick-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus }),
      })
      if (res.ok) {
        await fetchStats()
      }
    } catch (err) {
      console.error('Quick status update error:', err)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  if (loading && !stats) {
    return (
      <div style={{ padding: '2rem 1rem', background: '#FDFBF7', borderRadius: '16px', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1B5E20' }}>
          <RefreshCw size={24} className="animate-spin" />
          <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>Loading Bakery Dashboard & Live Orders...</span>
        </div>
      </div>
    )
  }

  const todayDateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Filter orders by tab
  const filteredOrders = (stats?.activeOrders || []).filter((o: any) => {
    if (activeTab === 'all') return true
    return o.orderStatus === activeTab
  })

  // Maximum revenue in last 7 days for bar scaling
  const maxRevenue = Math.max(...(stats?.last7Days || []).map((d: any) => d.revenue), 1)

  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#FAF6F0',
        borderRadius: '24px',
        padding: '2rem',
        marginBottom: '2.5rem',
        border: '1px solid #EADBCC',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* 1. Header Banner */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid #EADBCC',
          marginBottom: '1.75rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>🧁</span>
            <h1
              style={{
                margin: 0,
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#1B5E20',
                letterSpacing: '-0.02em',
              }}
            >
              Flavourite Bakery Kitchen Dashboard
            </h1>
          </div>
          <p style={{ margin: '4px 0 0 0', color: '#6B7280', fontSize: '0.9rem' }}>
            Welcome back, Mom! 🌸 Live kitchen orders, oven baking queue, and daily revenue.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #EADBCC',
              borderRadius: '999px',
              padding: '6px 14px',
              fontSize: '0.82rem',
              color: '#374151',
              fontWeight: 600,
            }}
          >
            🗓️ {todayDateStr}
          </div>

          <button
            onClick={fetchStats}
            disabled={refreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#1B5E20',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '999px',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Updating...' : 'Live Refresh'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: '#FEE2E2',
            color: '#B91C1C',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            fontSize: '0.88rem',
          }}
        >
          {error}
        </div>
      )}

      {/* 2. Top Metric KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {/* Today's Revenue */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '1.25rem',
            border: '1px solid #E5E7EB',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1B5E20', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Today's Revenue
            </span>
            <span style={{ background: '#DCFCE7', color: '#15803D', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
              ₹ Paid
            </span>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#111827' }}>
            ₹{stats?.todayRevenue?.toLocaleString('en-IN') || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '4px' }}>
            From {stats?.todayOrdersCount || 0} order(s) today • Total ₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}
          </div>
        </div>

        {/* Needs Attention / New */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '1.25rem',
            border: stats?.newOrdersCount > 0 ? '2px solid #F59E0B' : '1px solid #E5E7EB',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🆕 New Orders
            </span>
            <span style={{ background: '#FEF3C7', color: '#B45309', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
              Needs Review
            </span>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#B45309' }}>
            {stats?.newOrdersCount || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '4px' }}>
            Ready to confirm & bake
          </div>
        </div>

        {/* In the Oven */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '1.25rem',
            border: stats?.bakingCount > 0 ? '2px solid #EA580C' : '1px solid #E5E7EB',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#C2410C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🧁 In The Oven
            </span>
            <span style={{ background: '#FFEDD5', color: '#C2410C', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
              Baking Now
            </span>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#C2410C' }}>
            {stats?.bakingCount || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '4px' }}>
            Currently baking in kitchen
          </div>
        </div>

        {/* Out for Delivery */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '1.25rem',
            border: '1px solid #E5E7EB',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🛵 Out for Delivery
            </span>
            <span style={{ background: '#DBEAFE', color: '#1D4ED8', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
              On The Way
            </span>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#1D4ED8' }}>
            {stats?.outForDeliveryCount || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '4px' }}>
            Dispatched with rider
          </div>
        </div>

        {/* Delivered Today */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            padding: '1.25rem',
            border: '1px solid #E5E7EB',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🎉 Delivered Today
            </span>
            <span style={{ background: '#DCFCE7', color: '#15803D', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
              Completed
            </span>
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#15803D' }}>
            {stats?.deliveredTodayCount || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '4px' }}>
            All-time {stats?.totalOrders || 0} orders
          </div>
        </div>
      </div>

      {/* 3. Out of Stock Warning (If any) */}
      {stats?.soldOutProducts?.length > 0 && (
        <div
          style={{
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '16px',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} color="#D97706" />
            <span style={{ fontSize: '0.9rem', color: '#92400E', fontWeight: 600 }}>
              ⚠️ {stats.soldOutProducts.length} item(s) are currently marked "Sold Out" on the website:
              <strong style={{ marginLeft: '6px', color: '#78350F' }}>
                {stats.soldOutProducts.map((p: any) => p.name).join(', ')}
              </strong>
            </span>
          </div>
          <Link
            href="/admin/collections/products"
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: '#B45309',
              textDecoration: 'underline',
              whiteSpace: 'nowrap',
            }}
          >
            Update Stock →
          </Link>
        </div>
      )}

      {/* 4. Sales Trend Bar Chart (Last 7 Days) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '1.5rem',
          border: '1px solid #E5E7EB',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#111827' }}>
              📊 7-Day Revenue & Orders Trend
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: '#6B7280' }}>
              Daily sales over the last 7 days
            </p>
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1B5E20', background: '#F0FDF4', padding: '6px 12px', borderRadius: '999px' }}>
            Avg Order: ₹{stats?.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders) : 0}
          </div>
        </div>

        {/* Bars Container */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '12px',
            alignItems: 'flex-end',
            height: '160px',
            paddingTop: '20px',
            borderBottom: '1px solid #F3F4F6',
          }}
        >
          {(stats?.last7Days || []).map((day: any, idx: number) => {
            const heightPct = Math.max(Math.round((day.revenue / maxRevenue) * 100), 12)
            const isToday = idx === 6
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isToday ? '#1B5E20' : '#4B5563', marginBottom: '6px' }}>
                  ₹{day.revenue > 0 ? `${day.revenue}` : '0'}
                </div>

                <div
                  style={{
                    width: '100%',
                    maxWidth: '48px',
                    height: `${heightPct}%`,
                    background: isToday
                      ? 'linear-gradient(180deg, #1B5E20 0%, #2E7D32 100%)'
                      : day.revenue > 0
                      ? 'linear-gradient(180deg, #A7F3D0 0%, #6EE7B7 100%)'
                      : '#F3F4F6',
                    borderRadius: '8px 8px 0 0',
                    transition: 'all 0.3s ease',
                  }}
                  title={`${day.date} (${day.dayName}): ₹${day.revenue} (${day.ordersCount} orders)`}
                />

                <div style={{ marginTop: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: isToday ? 800 : 600, color: isToday ? '#1B5E20' : '#374151' }}>
                    {day.dayName}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>{day.date}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 5. Live Kitchen Orders Queue (Interactive) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          padding: '1.5rem',
          border: '1px solid #E5E7EB',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#111827' }}>
              🧁 Kitchen Orders Queue
            </h3>
            <p style={{ margin: '3px 0 0 0', fontSize: '0.8rem', color: '#6B7280' }}>
              Review orders, update baking/dispatch status with 1-click, and message customers on WhatsApp.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', background: '#F3F4F6', padding: '4px', borderRadius: '12px' }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeTab === 'all' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'all' ? '#111827' : '#6B7280',
                boxShadow: activeTab === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              All Recent ({stats?.activeOrders?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('new')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeTab === 'new' ? '#FEF3C7' : 'transparent',
                color: activeTab === 'new' ? '#B45309' : '#6B7280',
              }}
            >
              🆕 New ({stats?.newOrdersCount || 0})
            </button>
            <button
              onClick={() => setActiveTab('preparing')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeTab === 'preparing' ? '#FFEDD5' : 'transparent',
                color: activeTab === 'preparing' ? '#C2410C' : '#6B7280',
              }}
            >
              🧁 In Oven ({stats?.bakingCount || 0})
            </button>
            <button
              onClick={() => setActiveTab('out_for_delivery')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: activeTab === 'out_for_delivery' ? '#DBEAFE' : 'transparent',
                color: activeTab === 'out_for_delivery' ? '#1D4ED8' : '#6B7280',
              }}
            >
              🛵 In Transit ({stats?.outForDeliveryCount || 0})
            </button>
          </div>
        </div>

        {/* Orders List / Cards */}
        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9CA3AF' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎉</div>
            <p style={{ margin: 0, fontWeight: 600 }}>No orders currently in this queue!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredOrders.map((order: any) => {
              const cleanPhone = (order.customerPhone || '').replace(/\D/g, '')
              const waText = encodeURIComponent(
                `Hello ${order.customerName}! 🧁 This is Flavourite Bakery regarding your order #${order.orderNumber}.`
              )
              const waUrl = `https://wa.me/91${cleanPhone.slice(-10)}?text=${waText}`
              const printUrl = `/order-success?orderId=${encodeURIComponent(order.orderNumber)}`

              const isUpdating = updatingOrderId === order.id

              return (
                <div
                  key={order.id}
                  style={{
                    background: '#FAFAFA',
                    border: '1px solid #E5E7EB',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    transition: 'all 0.2s',
                  }}
                >
                  {/* Top row: ID, Customer, Slot, Status */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Link
                        href={`/admin/collections/orders/${order.id}`}
                        style={{
                          fontWeight: 800,
                          color: '#1B5E20',
                          fontSize: '0.95rem',
                          fontFamily: 'monospace',
                          textDecoration: 'none',
                        }}
                      >
                        #{order.orderNumber}
                      </Link>

                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>
                        {order.customerName}
                      </span>

                      <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                        📞 {order.customerPhone}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '999px',
                          background:
                            order.orderStatus === 'preparing'
                              ? '#FFEDD5'
                              : order.orderStatus === 'out_for_delivery'
                              ? '#DBEAFE'
                              : order.orderStatus === 'delivered'
                              ? '#DCFCE7'
                              : '#FEF3C7',
                          color:
                            order.orderStatus === 'preparing'
                              ? '#C2410C'
                              : order.orderStatus === 'out_for_delivery'
                              ? '#1D4ED8'
                              : order.orderStatus === 'delivered'
                              ? '#15803D'
                              : '#B45309',
                        }}
                      >
                        {order.orderStatus === 'preparing'
                          ? '🧁 Baking'
                          : order.orderStatus === 'out_for_delivery'
                          ? '🛵 Out for Delivery'
                          : order.orderStatus === 'delivered'
                          ? '🎉 Delivered'
                          : '🆕 New Order'}
                      </span>

                      <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827' }}>
                        ₹{order.total}
                      </span>
                    </div>
                  </div>

                  {/* Middle row: Items ordered */}
                  <div
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      border: '1px solid #F3F4F6',
                      fontSize: '0.85rem',
                      color: '#374151',
                    }}
                  >
                    <span style={{ fontWeight: 700, color: '#1B5E20', marginRight: '6px' }}>🍰 Items:</span>
                    <span>{order.itemsSummary || 'Standard Bakery Items'}</span>
                  </div>

                  {/* Special instruction callout if present */}
                  {order.specialInstructions && (
                    <div
                      style={{
                        background: '#FEF9C3',
                        border: '1px solid #FEF08A',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '0.82rem',
                        color: '#854D0E',
                        fontWeight: 600,
                      }}
                    >
                      ⚠️ Note: "{order.specialInstructions}"
                    </div>
                  )}

                  {/* Bottom row: Address, Delivery Slot, and Quick 1-Click Action Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      paddingTop: '6px',
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                      📍 <strong>Slot:</strong> {order.deliverySlot?.toUpperCase() || 'ASAP'} •{' '}
                      {order.deliveryAddress?.slice(0, 45)}...
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                      {/* 1-Click Status Advance */}
                      {order.orderStatus === 'new' && (
                        <button
                          onClick={() => handleQuickStatus(order.id, 'preparing')}
                          disabled={isUpdating}
                          style={{
                            background: '#EA580C',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          🧁 Start Baking
                        </button>
                      )}

                      {order.orderStatus === 'preparing' && (
                        <button
                          onClick={() => handleQuickStatus(order.id, 'out_for_delivery')}
                          disabled={isUpdating}
                          style={{
                            background: '#2563EB',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          🛵 Dispatch for Delivery
                        </button>
                      )}

                      {order.orderStatus === 'out_for_delivery' && (
                        <button
                          onClick={() => handleQuickStatus(order.id, 'delivered')}
                          disabled={isUpdating}
                          style={{
                            background: '#16A34A',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          🎉 Mark Delivered
                        </button>
                      )}

                      {/* WhatsApp Button */}
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: '#25D366',
                          color: '#FFFFFF',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        <MessageCircle size={13} />
                        <span>WhatsApp</span>
                      </a>

                      {/* Print Packing Slip */}
                      <a
                        href={printUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: '#E5E7EB',
                          color: '#374151',
                          borderRadius: '8px',
                          padding: '6px 10px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        <Printer size={13} />
                        <span>Print Slip</span>
                      </a>

                      {/* View details */}
                      <Link
                        href={`/admin/collections/orders/${order.id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#1B5E20',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          padding: '6px 8px',
                        }}
                      >
                        <span>Edit</span>
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 6. Quick Bakery Shortcuts Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '10px',
        }}
      >
        <Link
          href="/admin/collections/products/create"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '12px 14px',
            color: '#1B5E20',
            fontWeight: 700,
            fontSize: '0.85rem',
            textDecoration: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <PlusCircle size={18} color="#1B5E20" />
          <span>Add New Cake</span>
        </Link>

        <Link
          href="/admin/collections/orders"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '12px 14px',
            color: '#374151',
            fontWeight: 700,
            fontSize: '0.85rem',
            textDecoration: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <ShoppingBag size={18} color="#1B5E20" />
          <span>All Orders & History</span>
        </Link>

        <Link
          href="/admin/globals/store-settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '12px 14px',
            color: '#374151',
            fontWeight: 700,
            fontSize: '0.85rem',
            textDecoration: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <FileText size={18} color="#C8A951" />
          <span>Announcement Banner</span>
        </Link>

        <Link
          href="/"
          target="_blank"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '12px 14px',
            color: '#374151',
            fontWeight: 700,
            fontSize: '0.85rem',
            textDecoration: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}
        >
          <ExternalLink size={18} color="#6B7280" />
          <span>View Live Storefront</span>
        </Link>
      </div>
    </div>
  )
}
