'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ExternalLink, Store } from 'lucide-react'

export function AdminNavHeader() {
  const pathname = usePathname()
  const isDashboard = pathname === '/admin' || pathname === '/admin/'

  // When an order is opened with #courier, automatically switch to the Delivery & Courier tab
  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== 'undefined' && window.location.hash.toLowerCase().includes('courier')) {
        setTimeout(() => {
          const tabButtons = Array.from(document.querySelectorAll('.tabs-field__tab-button'))
          const courierTab = tabButtons.find((btn) => {
            const text = btn.textContent?.toLowerCase() || ''
            return text.includes('courier') || text.includes('delivery')
          }) as HTMLButtonElement | undefined

          if (courierTab && !courierTab.classList.contains('tabs-field__tab-button--active')) {
            courierTab.click()
            // Smoothly scroll tab into view if needed
            courierTab.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          }
        }, 250)
      }
    }

    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [pathname])

  return (
    <div
      style={{
        padding: '0 0 10px 0',
        margin: '0 0 10px 0',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        width: '100%',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 10px',
          marginBottom: '2px',
          background: '#F0FDF4',
          border: '1px solid #DCFCE7',
          borderRadius: '8px',
        }}
      >
        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>🧁</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.84rem',
              fontWeight: 800,
              lineHeight: 1.2,
              color: '#166534',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Flavourite Bakery
          </div>
          <div style={{ fontSize: '0.67rem', color: '#15803D', fontWeight: 600 }}>
            📍 Samalkot Kitchen
          </div>
        </div>
      </div>

      {/* Primary Dashboard Link */}
      <Link
        href="/admin"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 10px',
          borderRadius: '6px',
          fontSize: '0.84rem',
          fontWeight: 700,
          textDecoration: 'none',
          transition: 'all 0.15s ease',
          background: isDashboard ? '#1B5E20' : '#FFFFFF',
          color: isDashboard ? '#FFFFFF' : '#374151',
          border: isDashboard ? '1px solid #1B5E20' : '1px solid #E5E7EB',
          boxShadow: isDashboard ? '0 1px 3px rgba(27, 94, 32, 0.2)' : 'none',
        }}
      >
        <LayoutDashboard size={15} color={isDashboard ? '#FFFFFF' : '#1B5E20'} />
        <span>Bakery Dashboard</span>
      </Link>

      {/* Storefront Link */}
      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '7px 10px',
          borderRadius: '6px',
          fontSize: '0.78rem',
          fontWeight: 600,
          textDecoration: 'none',
          color: '#4B5563',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          transition: 'all 0.15s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <Store size={14} color="#1B5E20" />
          <span>Live Customer Store</span>
        </div>
        <ExternalLink size={12} color="#9CA3AF" />
      </Link>
    </div>
  )
}
