'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ExternalLink, Store } from 'lucide-react'

export function AdminNavHeader() {
  const pathname = usePathname()
  const isDashboard = pathname === '/admin' || pathname === '/admin/'

  return (
    <div
      style={{
        padding: '0 0.75rem 0.85rem 0.75rem',
        marginBottom: '0.75rem',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 12px',
          marginBottom: '2px',
          background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
          borderRadius: '10px',
          color: '#FFFFFF',
          boxShadow: '0 2px 4px rgba(27, 94, 32, 0.15)',
        }}
      >
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            flexShrink: 0,
          }}
        >
          🧁
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Flavourite Bakery
          </div>
          <div style={{ fontSize: '0.68rem', color: '#C8E6C9', fontWeight: 600 }}>
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
          gap: '10px',
          padding: '9px 12px',
          borderRadius: '8px',
          fontSize: '0.85rem',
          fontWeight: 700,
          textDecoration: 'none',
          transition: 'all 0.15s ease',
          background: isDashboard ? '#1B5E20' : '#F3F4F6',
          color: isDashboard ? '#FFFFFF' : '#1F2937',
          boxShadow: isDashboard ? '0 2px 6px rgba(27, 94, 32, 0.25)' : 'none',
        }}
      >
        <LayoutDashboard size={17} color={isDashboard ? '#FFFFFF' : '#1B5E20'} />
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
          padding: '8px 12px',
          borderRadius: '8px',
          fontSize: '0.78rem',
          fontWeight: 600,
          textDecoration: 'none',
          color: '#4B5563',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          transition: 'all 0.15s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Store size={14} color="#1B5E20" />
          <span>Live Customer Store</span>
        </div>
        <ExternalLink size={12} color="#9CA3AF" />
      </Link>
    </div>
  )
}
