'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  BarChart3,
  PieChart,
  Search,
  DollarSign,
  ArrowUpRight,
  Database,
} from 'lucide-react'

export function BakeryDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [backingUp, setBackingUp] = useState(false)
  const [backupSuccess, setBackupSuccess] = useState<string | null>(null)
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Interactive controls
  const [revenuePeriod, setRevenuePeriod] = useState<'today' | 'month' | 'all'>('today')
  const [chartTimeframe, setChartTimeframe] = useState<'7d' | '30d'>('7d')
  const [chartType, setChartType] = useState<'bar' | 'donut'>('bar')
  const [orderFilter, setOrderFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  const toggleFilter = (status: string) => {
    setOrderFilter((prev) => (prev === status ? 'all' : status))
  }

  const fetchStats = async () => {
    try {
      setRefreshing(true)
      const res = await fetch('/api/admin/dashboard-stats', { cache: 'no-store' })
      const data = await res.json()
      if (res.ok && data.stats) {
        setStats(data.stats)
        setError(null)
      } else {
        setError(data.error || 'Failed to load dashboard metrics')
      }
    } catch (err: any) {
      setError(err?.message || 'Error connecting to analytics server')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleQuickStatus = async (e: React.MouseEvent, orderId: string, newStatus: string) => {
    e.stopPropagation() // Don't trigger row click
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
      console.error('Status update failed:', err)
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const handleBackup = async () => {
    try {
      setBackingUp(true)
      setBackupSuccess(null)
      const res = await fetch('/api/admin/backup', { method: 'POST' })
      const data = await res.json()
      if (res.ok && data.success) {
        setBackupSuccess(`Database snapshot saved (${data.sizeKb} KB)`)
        setTimeout(() => setBackupSuccess(null), 5000)
      } else {
        alert(data.error || 'Backup failed')
      }
    } catch (err) {
      console.error('Backup error:', err)
      alert('Failed to trigger database backup')
    } finally {
      setBackingUp(false)
    }
  }

  if (loading && !stats) {
    return (
      <div style={{ padding: '2.5rem 1.5rem', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#1B5E20' }}>
          <RefreshCw size={22} className="animate-spin" />
          <span style={{ fontWeight: 600, fontSize: '1rem' }}>Loading Store Analytics & Operations Data...</span>
        </div>
      </div>
    )
  }

  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  // Selected revenue value
  const displayedRevenue =
    revenuePeriod === 'today'
      ? stats?.todayRevenue || 0
      : revenuePeriod === 'month'
      ? stats?.monthRevenue || 0
      : stats?.totalRevenue || 0

  const displayedRevenueOrders =
    revenuePeriod === 'today'
      ? stats?.todayOrdersCount || 0
      : revenuePeriod === 'month'
      ? stats?.monthOrdersCount || 0
      : stats?.totalOrders || 0

  // Chart data selection
  const chartData = chartTimeframe === '7d' ? stats?.last7Days || [] : stats?.last30Days || []
  const maxRevenue = Math.max(...chartData.map((d: any) => d.revenue), 1)

  // Status breakdown calculations
  const totalStatusOrders = Math.max(stats?.totalOrders || 1, 1)
  const statusCounts = stats?.statusCounts || {}
  const statusRevenue = stats?.statusRevenue || {}

  // Filter orders
  const filteredOrders = (stats?.activeOrders || []).filter((o: any) => {
    const matchesStatus = orderFilter === 'all' || o.orderStatus === orderFilter
    const query = searchQuery.toLowerCase().trim()
    if (!query) return matchesStatus
    const matchesSearch =
      (o.orderNumber && o.orderNumber.toLowerCase().includes(query)) ||
      (o.customerName && o.customerName.toLowerCase().includes(query)) ||
      (o.customerPhone && o.customerPhone.includes(query)) ||
      (o.itemsSummary && o.itemsSummary.toLowerCase().includes(query))
    return matchesStatus && matchesSearch
  })

  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        background: '#F9FAFB',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2.5rem',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* 1. Header & Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid #E5E7EB',
          marginBottom: '1.75rem',
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '1.6rem',
              fontWeight: 800,
              color: '#111827',
              letterSpacing: '-0.02em',
            }}
          >
            Flavourite Store Operations & Analytics
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#6B7280', fontSize: '0.88rem' }}>
            Live sales revenue, fulfillment status, and order dispatch management.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.8rem',
              color: '#4B5563',
              fontWeight: 600,
            }}
          >
            {currentDate}
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
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: '#FEE2E2',
            color: '#B91C1C',
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            fontSize: '0.85rem',
          }}
        >
          {error}
        </div>
      )}

      {/* 2. Top Interactive Metric Cards (Clickable) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {/* Metric 1: Revenue (Interactive Toggle) */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.25rem',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1B5E20', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Store Revenue
              </span>
              <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: '6px', padding: '2px' }}>
                <button
                  onClick={() => setRevenuePeriod('today')}
                  style={{
                    border: 'none',
                    padding: '2px 6px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: revenuePeriod === 'today' ? '#FFFFFF' : 'transparent',
                    color: revenuePeriod === 'today' ? '#1B5E20' : '#6B7280',
                  }}
                >
                  Today
                </button>
                <button
                  onClick={() => setRevenuePeriod('month')}
                  style={{
                    border: 'none',
                    padding: '2px 6px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: revenuePeriod === 'month' ? '#FFFFFF' : 'transparent',
                    color: revenuePeriod === 'month' ? '#1B5E20' : '#6B7280',
                  }}
                >
                  30D
                </button>
                <button
                  onClick={() => setRevenuePeriod('all')}
                  style={{
                    border: 'none',
                    padding: '2px 6px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: revenuePeriod === 'all' ? '#FFFFFF' : 'transparent',
                    color: revenuePeriod === 'all' ? '#1B5E20' : '#6B7280',
                  }}
                >
                  Total
                </button>
              </div>
            </div>

            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: '4px 0' }}>
              ₹{displayedRevenue.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>
              {displayedRevenueOrders} orders ({revenuePeriod === 'today' ? 'today' : revenuePeriod === 'month' ? 'last 30 days' : 'all time'})
            </div>
          </div>

          <Link
            href="/admin/collections/orders"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#1B5E20',
              textDecoration: 'none',
              marginTop: '12px',
              paddingTop: '8px',
              borderTop: '1px solid #F3F4F6',
            }}
          >
            <span>View Full Orders Ledger</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Metric 2: New Orders (Clickable Filter) */}
        <div
          onClick={() => toggleFilter('new')}
          style={{
            background: orderFilter === 'new' ? '#FEF3C7' : '#FFFFFF',
            borderRadius: '16px',
            padding: '1.25rem',
            border: orderFilter === 'new' ? '2px solid #D97706' : '1px solid #E5E7EB',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              New Orders
            </span>
            <span style={{ background: orderFilter === 'new' ? '#F59E0B' : '#FEF3C7', color: orderFilter === 'new' ? '#FFFFFF' : '#B45309', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>
              {orderFilter === 'new' ? 'Filter Active ✕' : 'Action Req.'}
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#B45309', margin: '4px 0' }}>
            {statusCounts.new || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: orderFilter === 'new' ? '#92400E' : '#6B7280', fontWeight: orderFilter === 'new' ? 700 : 400 }}>
            {orderFilter === 'new' ? 'Click to show all orders' : 'Click to filter queue below'}
          </div>
        </div>

        {/* Metric 3: In Kitchen / Preparing */}
        <div
          onClick={() => toggleFilter('preparing')}
          style={{
            background: orderFilter === 'preparing' ? '#FFEDD5' : '#FFFFFF',
            borderRadius: '16px',
            padding: '1.25rem',
            border: orderFilter === 'preparing' ? '2px solid #EA580C' : '1px solid #E5E7EB',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C2410C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              In Kitchen
            </span>
            <span style={{ background: orderFilter === 'preparing' ? '#EA580C' : '#FFEDD5', color: orderFilter === 'preparing' ? '#FFFFFF' : '#C2410C', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>
              {orderFilter === 'preparing' ? 'Filter Active ✕' : 'Preparing'}
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#C2410C', margin: '4px 0' }}>
            {statusCounts.preparing || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: orderFilter === 'preparing' ? '#9A3412' : '#6B7280', fontWeight: orderFilter === 'preparing' ? 700 : 400 }}>
            {orderFilter === 'preparing' ? 'Click to show all orders' : 'Currently in production'}
          </div>
        </div>

        {/* Metric 4: Out for Delivery */}
        <div
          onClick={() => toggleFilter('out_for_delivery')}
          style={{
            background: orderFilter === 'out_for_delivery' ? '#DBEAFE' : '#FFFFFF',
            borderRadius: '16px',
            padding: '1.25rem',
            border: orderFilter === 'out_for_delivery' ? '2px solid #2563EB' : '1px solid #E5E7EB',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Out for Delivery
            </span>
            <span style={{ background: orderFilter === 'out_for_delivery' ? '#2563EB' : '#DBEAFE', color: orderFilter === 'out_for_delivery' ? '#FFFFFF' : '#1D4ED8', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>
              {orderFilter === 'out_for_delivery' ? 'Filter Active ✕' : 'In Transit'}
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1D4ED8', margin: '4px 0' }}>
            {statusCounts.out_for_delivery || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: orderFilter === 'out_for_delivery' ? '#1E40AF' : '#6B7280', fontWeight: orderFilter === 'out_for_delivery' ? 700 : 400 }}>
            {orderFilter === 'out_for_delivery' ? 'Click to show all orders' : 'Dispatched with rider / courier'}
          </div>
        </div>

        {/* Metric 5: Completed / Delivered */}
        <div
          onClick={() => toggleFilter('delivered')}
          style={{
            background: orderFilter === 'delivered' ? '#DCFCE7' : '#FFFFFF',
            borderRadius: '16px',
            padding: '1.25rem',
            border: orderFilter === 'delivered' ? '2px solid #16A34A' : '1px solid #E5E7EB',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Completed
            </span>
            <span style={{ background: orderFilter === 'delivered' ? '#16A34A' : '#DCFCE7', color: orderFilter === 'delivered' ? '#FFFFFF' : '#15803D', padding: '3px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>
              {orderFilter === 'delivered' ? 'Filter Active ✕' : 'Delivered'}
            </span>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#15803D', margin: '4px 0' }}>
            {statusCounts.delivered || 0}
          </div>
          <div style={{ fontSize: '0.78rem', color: orderFilter === 'delivered' ? '#14532D' : '#6B7280', fontWeight: orderFilter === 'delivered' ? 700 : 400 }}>
            {orderFilter === 'delivered' ? 'Click to show all orders' : `${Math.round(((statusCounts.delivered || 0) / totalStatusOrders) * 100)}% fulfillment rate`}
          </div>
        </div>
      </div>

      {/* 3. Out of Stock Alert (If any) */}
      {stats?.soldOutProducts?.length > 0 && (
        <div
          style={{
            background: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '12px',
            padding: '0.85rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#D97706" />
            <span style={{ fontSize: '0.85rem', color: '#92400E', fontWeight: 600 }}>
              Notice: {stats.soldOutProducts.length} product(s) currently marked Sold Out on storefront:
              <strong style={{ marginLeft: '4px', color: '#78350F' }}>
                {stats.soldOutProducts.map((p: any) => p.name).join(', ')}
              </strong>
            </span>
          </div>
          <Link
            href="/admin/collections/products"
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#B45309',
              textDecoration: 'underline',
              whiteSpace: 'nowrap',
            }}
          >
            Manage Inventory →
          </Link>
        </div>
      )}

      {/* 4. Analytics & Trends Component with Filters */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid #E5E7EB',
          marginBottom: '2rem',
        }}
      >
        {/* Controls: Timeframe & Chart Type */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.25rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #F3F4F6',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>
              Sales & Fulfillment Analytics
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#6B7280' }}>
              Track revenue velocity, order volumes, and fulfillment stage distribution.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
            {/* Timeframe Filter */}
            <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: '8px', padding: '3px' }}>
              <button
                onClick={() => setChartTimeframe('7d')}
                style={{
                  border: 'none',
                  padding: '5px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: chartTimeframe === '7d' ? '#FFFFFF' : 'transparent',
                  color: chartTimeframe === '7d' ? '#1B5E20' : '#6B7280',
                  boxShadow: chartTimeframe === '7d' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setChartTimeframe('30d')}
                style={{
                  border: 'none',
                  padding: '5px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: chartTimeframe === '30d' ? '#FFFFFF' : 'transparent',
                  color: chartTimeframe === '30d' ? '#1B5E20' : '#6B7280',
                  boxShadow: chartTimeframe === '30d' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                Last 30 Days (Month)
              </button>
            </div>

            {/* Chart Type Toggle */}
            <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: '8px', padding: '3px' }}>
              <button
                onClick={() => setChartType('bar')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: 'none',
                  padding: '5px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: chartType === 'bar' ? '#FFFFFF' : 'transparent',
                  color: chartType === 'bar' ? '#111827' : '#6B7280',
                  boxShadow: chartType === 'bar' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                <BarChart3 size={13} />
                <span>Bar Chart</span>
              </button>
              <button
                onClick={() => setChartType('donut')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: 'none',
                  padding: '5px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: chartType === 'donut' ? '#FFFFFF' : 'transparent',
                  color: chartType === 'donut' ? '#111827' : '#6B7280',
                  boxShadow: chartType === 'donut' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                <PieChart size={13} />
                <span>Distribution</span>
              </button>
            </div>
          </div>
        </div>

        {/* View 1: Bar Chart */}
        {chartType === 'bar' && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${chartData.length}, 1fr)`,
                gap: chartTimeframe === '7d' ? '12px' : '3px',
                alignItems: 'flex-end',
                height: '180px',
                paddingTop: '20px',
                borderBottom: '1px solid #F3F4F6',
              }}
            >
              {chartData.map((day: any, idx: number) => {
                const heightPct = Math.max(Math.round((day.revenue / maxRevenue) * 100), 8)
                const isLatest = idx === chartData.length - 1
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
                    {chartTimeframe === '7d' && (
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: isLatest ? '#1B5E20' : '#4B5563', marginBottom: '6px' }}>
                        ₹{day.revenue > 0 ? day.revenue : '0'}
                      </div>
                    )}

                    <div
                      style={{
                        width: '100%',
                        maxWidth: chartTimeframe === '7d' ? '48px' : '18px',
                        height: `${heightPct}%`,
                        background: isLatest
                          ? '#1B5E20'
                          : day.revenue > 0
                          ? '#6EE7B7'
                          : '#F3F4F6',
                        borderRadius: '4px 4px 0 0',
                        transition: 'all 0.2s ease',
                      }}
                      title={`${day.date}: ₹${day.revenue} (${day.ordersCount} orders)`}
                    />

                    <div style={{ marginTop: '8px', textAlign: 'center' }}>
                      {chartTimeframe === '7d' ? (
                        <>
                          <div style={{ fontSize: '0.74rem', fontWeight: isLatest ? 800 : 600, color: isLatest ? '#1B5E20' : '#374151' }}>
                            {day.dayName}
                          </div>
                          <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>{day.date}</div>
                        </>
                      ) : (
                        idx % 5 === 0 && <div style={{ fontSize: '0.62rem', color: '#9CA3AF' }}>{day.date}</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '0.75rem', color: '#6B7280' }}>
              <span>Period: {chartTimeframe === '7d' ? 'Last 7 Days' : 'Last 30 Days'}</span>
              <span>Average Order Value: <strong style={{ color: '#1B5E20' }}>₹{stats?.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders) : 0}</strong></span>
            </div>
          </div>
        )}

        {/* View 2: Status Distribution (Donut / Progress Breakdown) */}
        {chartType === 'donut' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '10px' }}>
              {/* Delivered */}
              <div style={{ padding: '1rem', borderRadius: '12px', background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803D', textTransform: 'uppercase' }}>
                  Delivered ({statusCounts.delivered || 0})
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#166534', margin: '4px 0' }}>
                  ₹{(statusRevenue.delivered || 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#15803D' }}>
                  {Math.round(((statusCounts.delivered || 0) / totalStatusOrders) * 100)}% of total orders
                </div>
              </div>

              {/* Out for Delivery */}
              <div style={{ padding: '1rem', borderRadius: '12px', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1D4ED8', textTransform: 'uppercase' }}>
                  In Transit ({statusCounts.out_for_delivery || 0})
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E40AF', margin: '4px 0' }}>
                  ₹{(statusRevenue.out_for_delivery || 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#1D4ED8' }}>
                  {Math.round(((statusCounts.out_for_delivery || 0) / totalStatusOrders) * 100)}% of total orders
                </div>
              </div>

              {/* Preparing */}
              <div style={{ padding: '1rem', borderRadius: '12px', background: '#FFF7ED', border: '1px solid #FED7AA' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C2410C', textTransform: 'uppercase' }}>
                  In Kitchen ({statusCounts.preparing || 0})
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#9A3412', margin: '4px 0' }}>
                  ₹{(statusRevenue.preparing || 0).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#C2410C' }}>
                  {Math.round(((statusCounts.preparing || 0) / totalStatusOrders) * 100)}% of total orders
                </div>
              </div>

              {/* New / Confirmed */}
              <div style={{ padding: '1rem', borderRadius: '12px', background: '#FEFCE8', border: '1px solid #FEF08A' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#A16207', textTransform: 'uppercase' }}>
                  Queued / Confirmed ({(statusCounts.new || 0) + (statusCounts.confirmed || 0)})
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#854D0E', margin: '4px 0' }}>
                  ₹{((statusRevenue.new || 0) + (statusRevenue.confirmed || 0)).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#A16207' }}>
                  {Math.round((((statusCounts.new || 0) + (statusCounts.confirmed || 0)) / totalStatusOrders) * 100)}% of total orders
                </div>
              </div>
            </div>

            {/* Visual segmented bar */}
            <div style={{ marginTop: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4B5563', marginBottom: '6px' }}>
                Status Distribution Bar
              </div>
              <div style={{ display: 'flex', height: '14px', borderRadius: '7px', overflow: 'hidden' }}>
                <div style={{ width: `${((statusCounts.delivered || 0) / totalStatusOrders) * 100}%`, background: '#16A34A' }} title="Delivered" />
                <div style={{ width: `${((statusCounts.out_for_delivery || 0) / totalStatusOrders) * 100}%`, background: '#2563EB' }} title="Out for Delivery" />
                <div style={{ width: `${((statusCounts.preparing || 0) / totalStatusOrders) * 100}%`, background: '#EA580C' }} title="Preparing" />
                <div style={{ width: `${(((statusCounts.new || 0) + (statusCounts.confirmed || 0)) / totalStatusOrders) * 100}%`, background: '#FACC15' }} title="New / Confirmed" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Live Orders Queue (Clickable Rows -> Full Order Edit) */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
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
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>
              Active Orders & Fulfillment Queue
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#6B7280' }}>
              Click any order to open full details. Use buttons for quick status updates or WhatsApp messaging.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            {orderFilter !== 'all' && (
              <button
                onClick={() => setOrderFilter('all')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#FEF2F2',
                  color: '#B91C1C',
                  border: '1px solid #FECACA',
                  borderRadius: '8px',
                  padding: '5px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <span>Filtered: {orderFilter.replace('_', ' ').toUpperCase()} (Click to View All ✕)</span>
              </button>
            )}

            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '6px 12px 6px 30px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  fontSize: '0.8rem',
                  outline: 'none',
                  width: '180px',
                }}
              />
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', background: '#F3F4F6', padding: '3px', borderRadius: '8px' }}>
              {['all', 'new', 'preparing', 'out_for_delivery', 'delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: orderFilter === st ? '#FFFFFF' : 'transparent',
                    color: orderFilter === st ? '#111827' : '#6B7280',
                    boxShadow: orderFilter === st ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                    textTransform: 'capitalize',
                  }}
                >
                  {st === 'all' ? 'All' : st === 'out_for_delivery' ? 'Transit' : st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#9CA3AF', fontSize: '0.88rem' }}>
            No orders found matching this filter.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredOrders.map((order: any) => {
              const cleanPhone = (order.customerPhone || '').replace(/\D/g, '')
              const waText = encodeURIComponent(
                `Hello ${order.customerName}, this is Flavourite regarding your order #${order.orderNumber}.`
              )
              const waUrl = `https://wa.me/91${cleanPhone.slice(-10)}?text=${waText}`
              const printUrl = `/order-success?orderId=${encodeURIComponent(order.orderNumber)}`
              const isUpdating = updatingOrderId === order.id

              return (
                <div
                  key={order.id}
                  onClick={() => router.push(`/admin/collections/orders/${order.id}`)}
                  style={{
                    background: '#FAFAFA',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F3F4F6'
                    e.currentTarget.style.borderColor = '#D1D5DB'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#FAFAFA'
                    e.currentTarget.style.borderColor = '#E5E7EB'
                  }}
                >
                  {/* Top row */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, color: '#1B5E20', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                        #{order.orderNumber}
                      </span>
                      <span style={{ fontWeight: 700, color: '#111827', fontSize: '0.85rem' }}>
                        {order.customerName}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>
                        {order.customerPhone}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          textTransform: 'uppercase',
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
                        {order.orderStatus?.replace('_', ' ') || 'New'}
                      </span>

                      <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#111827' }}>
                        ₹{order.total}
                      </span>
                    </div>
                  </div>

                  {/* Middle row: Items */}
                  <div style={{ fontSize: '0.82rem', color: '#374151' }}>
                    <strong>Items:</strong> {order.itemsSummary || 'Bakery Items'}
                  </div>

                  {order.specialInstructions && (
                    <div
                      style={{
                        background: '#FEF9C3',
                        border: '1px solid #FEF08A',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        fontSize: '0.78rem',
                        color: '#854D0E',
                        fontWeight: 600,
                      }}
                    >
                      Instruction: "{order.specialInstructions}"
                    </div>
                  )}

                  {/* Bottom row: Quick action buttons */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      paddingTop: '4px',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      Slot: {order.deliverySlot?.toUpperCase() || 'ASAP'} • {order.deliveryAddress?.slice(0, 40)}...
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }} onClick={(e) => e.stopPropagation()}>
                      {/* 1-Click Status Controls */}
                      {order.orderStatus === 'new' && (
                        <button
                          onClick={(e) => handleQuickStatus(e, order.id, 'preparing')}
                          disabled={isUpdating}
                          style={{
                            background: '#EA580C',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '5px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Start Preparation
                        </button>
                      )}

                      {order.orderStatus === 'preparing' && (
                        <button
                          onClick={(e) => handleQuickStatus(e, order.id, 'out_for_delivery')}
                          disabled={isUpdating}
                          style={{
                            background: '#2563EB',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '5px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Dispatch Order
                        </button>
                      )}

                      {order.orderStatus === 'out_for_delivery' && (
                        <button
                          onClick={(e) => handleQuickStatus(e, order.id, 'delivered')}
                          disabled={isUpdating}
                          style={{
                            background: '#16A34A',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '5px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Mark Delivered
                        </button>
                      )}

                      {/* WhatsApp */}
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: '#25D366',
                          color: '#FFFFFF',
                          borderRadius: '6px',
                          padding: '5px 8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        <MessageCircle size={12} />
                        <span>WhatsApp</span>
                      </a>

                      {/* Print */}
                      <a
                        href={printUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: '#E5E7EB',
                          color: '#374151',
                          borderRadius: '6px',
                          padding: '5px 8px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        <Printer size={12} />
                        <span>Slip</span>
                      </a>

                      {/* Open Full Document */}
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          color: '#1B5E20',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '5px 6px',
                        }}
                      >
                        <span>Full Order</span>
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 6. Quick Operations Shortcuts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '8px',
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
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#1B5E20',
            fontWeight: 700,
            fontSize: '0.82rem',
            textDecoration: 'none',
          }}
        >
          <PlusCircle size={16} color="#1B5E20" />
          <span>Add New Product</span>
        </Link>

        <Link
          href="/admin/collections/orders"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#374151',
            fontWeight: 700,
            fontSize: '0.82rem',
            textDecoration: 'none',
          }}
        >
          <ShoppingBag size={16} color="#1B5E20" />
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
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#374151',
            fontWeight: 700,
            fontSize: '0.82rem',
            textDecoration: 'none',
          }}
        >
          <FileText size={16} color="#C8A951" />
          <span>Store Settings & Banner</span>
        </Link>

        <button
          onClick={handleBackup}
          disabled={backingUp}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: backupSuccess ? '#DCFCE7' : '#FFFFFF',
            border: backupSuccess ? '1px solid #86EFAC' : '1px solid #E5E7EB',
            borderRadius: '10px',
            padding: '10px 14px',
            color: backupSuccess ? '#15803D' : '#374151',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
          }}
        >
          <Database size={16} color={backupSuccess ? '#15803D' : '#4B5563'} />
          <span>{backingUp ? 'Backing up...' : backupSuccess || 'Backup Database'}</span>
        </button>

        <Link
          href="/"
          target="_blank"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#374151',
            fontWeight: 700,
            fontSize: '0.82rem',
            textDecoration: 'none',
          }}
        >
          <ExternalLink size={16} color="#6B7280" />
          <span>View Live Store</span>
        </Link>
      </div>
    </div>
  )
}
